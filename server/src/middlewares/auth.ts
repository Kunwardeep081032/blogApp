// auth middleware check for invalid jwt

import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config";
import { User } from "../models";
import type { JwtPayload } from "../types";
import ApiError from "../utils/apiError";
import { handleControllerError } from "../utils/helper";

export const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new ApiError(401, "Unauthorized - No token provided");
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      const user = await User.findById(decoded.id);
      if (!user) {
        throw new ApiError(401, "Unauthorized - Invalid token");
      }
      req.user = {
        id: user._id.toString(),
        role: user.role,
      };
      next();
    } catch (jwtError) {
      if (jwtError instanceof jwt.JsonWebTokenError) {
        throw new ApiError(401, "Unauthorized - Invalid token");
      } else if (jwtError instanceof jwt.TokenExpiredError) {
        throw new ApiError(401, "Unauthorized - Token expired");
      } else {
        throw new ApiError(500, "Internal server error during authentication");
      }
    }
  } catch (error) {
    handleControllerError(error, res);
  }
};

export const isAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.role !== "admin") {
      throw new ApiError(403, "Access denied. Admin privileges required");
    }

    next();
  } catch (error) {
    handleControllerError(error, res);
  }
};
