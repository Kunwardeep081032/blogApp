// User Controller

import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import { z } from "zod";
import { User } from "../models";
import type { AuthResponse } from "../types";
import ApiError from "../utils/apiError";
import { sendVerificationEmail } from "../utils/email";
import {
  VERIFICATION_TOKEN_EXPIRY,
  formatUserResponse,
  generateToken,
  generateVerificationToken,
} from "../utils/helper";
import { handleControllerError } from "../utils/helper";
import { signInSchema, userSchema } from "../validators";

export const signup = async (req: Request, res: Response<AuthResponse>) => {
  try {
    const { firstName, lastName, username, email, password } = userSchema.parse(req.body);

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      throw new ApiError(400, `User already exists with this ${existingUser.email === email ? "email" : "username"}`);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = generateVerificationToken();

    const user = await User.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      lastLogin: new Date(),
      emailVerificationToken: verificationToken,
      emailVerificationExpiry: new Date(Date.now() + VERIFICATION_TOKEN_EXPIRY),
    });

    await sendVerificationEmail(user.email, verificationToken);

    generateToken(res, user._id.toString());

    res.status(201).json({
      success: true,
      message: "User created successfully. Please check your email to verify your account.",
      user: formatUserResponse(user),
    });
  } catch (error: any) {
    handleControllerError(error, res);
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = signInSchema.parse(req.body);

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new ApiError(400, "Invalid credentials");

    user.lastLogin = new Date();
    await user.save();

    generateToken(res, user._id.toString());

    res.status(200).json({
      success: true,
      user: formatUserResponse(user),
    });
  } catch (error: any) {
    handleControllerError(error, res);
  }
};

export const checkAuth = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select("-password -savedPosts -posts");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ user });
  } catch (error: any) {
    handleControllerError(error, res);
  }
};

export const signout = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Signout successful" });
};

//TODO: better way to update user
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const updates = userSchema.partial().parse(req.body);

    updates.password = undefined;
    updates.email = undefined;
    updates.role = undefined;
    updates.isEmailVerified = undefined;

    const user = await User.findByIdAndUpdate(req.user.id, { $set: updates }, { new: true, runValidators: true });

    if (!user) throw new ApiError(404, "User not found");

    res.status(200).json({
      success: true,
      user: formatUserResponse(user),
    });
  } catch (error: any) {
    handleControllerError(error, res);
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId || req.user.id;

    const user = await User.findById(userId)
      .select("-password -savedPosts")
      .populate("posts", "title content createdAt");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    res.status(200).json({
      success: true,
      user: formatUserResponse(user),
    });
  } catch (error: any) {
    handleControllerError(error, res);
  }
};

export const getProfiles = async (req: Request, res: Response) => {
  try {
    const page = Number.parseInt(req.query.page as string) || 1;
    const limit = Number.parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find().select("-password -savedPosts").skip(skip).limit(limit).sort({ createdAt: -1 });

    const total = await User.countDocuments();

    res.status(200).json({
      success: true,
      users: users.map(formatUserResponse),
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        hasMore: skip + users.length < total,
      },
    });
  } catch (error: any) {
    handleControllerError(error, res);
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpiry: { $gt: Date.now() },
    });

    if (!user) {
      throw new ApiError(400, "Invalid or expired verification token");
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error: any) {
    handleControllerError(error, res);
  }
};

export const resendVerificationEmail = async (req: Request, res: Response) => {
  try {
    const { callbackUrl } = req.query;
    const user = await User.findById(req.user.id);
    if (!user) throw new ApiError(404, "User not found");

    if (user.isEmailVerified) {
      throw new ApiError(400, "Email is already verified");
    }

    const verificationToken = generateVerificationToken();
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpiry = new Date(Date.now() + VERIFICATION_TOKEN_EXPIRY);
    await user.save();

    await sendVerificationEmail(user.email, verificationToken, callbackUrl as string);

    res.status(200).json({
      success: true,
      message: "Verification email sent successfully",
    });
  } catch (error: any) {
    handleControllerError(error, res);
  }
};
