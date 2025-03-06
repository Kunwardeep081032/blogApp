// Check email verification middleware

import type { NextFunction, Request, Response } from "express";
import { User } from "../models";
import ApiError from "../utils/apiError";

export const requireVerifiedEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (!user.isEmailVerified) {
      throw new ApiError(403, "Please verify your email address before creating posts");
    }

    next();
  } catch (error) {
    next(error);
  }
};
