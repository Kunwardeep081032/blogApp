// Error and other helper functions

import type { Response } from "express";
import jwt from "jsonwebtoken";
import type mongoose from "mongoose";
import type { PipelineStage } from "mongoose";
import { ZodError } from "zod";
import { JWT_SECRET } from "../config/config";
import type { Post } from "../models";
import type { UserResponse } from "../types";
import type { ValidatedSearchQuery } from "../validators";
import ApiError from "./apiError";

export const VERIFICATION_TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
export const generateVerificationToken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export function handleControllerError(error: unknown, res: Response) {
  console.log(error)
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: error.errors,
    });
  }

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
    });
  }

  console.log(error);
  return res.status(500).json({
    success: false,
    error: "An unexpected error occurred",
  });
}

export function buildSearchQuery(params: ValidatedSearchQuery): mongoose.FilterQuery<typeof Post> {
  const query: any = {};

  if (params.search?.trim() && params.searchField) {
    switch (params.searchField) {
      case "title":
        query.title = { $regex: params.search, $options: "i" };
        break;
      case "content":
        query.content = { $regex: params.search, $options: "i" };
        break;
      //   case "author":
      //    NOTE: why we have to handle this in the aggregation pipeline?
      // because we need to unwind the author details
      // unwind means we need to get the author details from the users collection
      //     break;
      case "tags":
        query.tags = { $regex: params.search, $options: "i" };
        break;
      default:
        query.$text = { $search: params.search };
    }
  } else if (params.search?.trim()) {
    query.$text = { $search: params.search };
  }
  return query;
}

export function buildAggregationPipeline(query: any, params: ValidatedSearchQuery): PipelineStage[] {
  const skip = (params.page - 1) * params.limit;
  const pipeline: PipelineStage[] = [];

  // if searching by author, add a lookup stage first
  if (params.searchField === "author" && params.search) {
    pipeline.push(
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorDetails",
        },
      },
      // unwind the author details
      { $unwind: "$authorDetails" },
      {
        $match: {
          $or: [
            {
              "authorDetails.username": {
                $regex: params.search,
                $options: "i",
              },
            },
            {
              "authorDetails.firstName": {
                $regex: params.search,
                $options: "i",
              },
            },
            {
              "authorDetails.lastName": {
                $regex: params.search,
                $options: "i",
              },
            },
          ],
        },
      },
    );
  }

  if (Object.keys(query).length > 0) {
    pipeline.push({ $match: query });
  }

  pipeline.push({
    $facet: {
      posts: [
        { $sort: { [params.sortBy]: params.sortOrder === "asc" ? 1 : -1 } },
        { $skip: skip },
        { $limit: params.limit },
        {
          $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            pipeline: [{ $project: { username: 1, firstName: 1, lastName: 1 } }],
            as: "author",
          },
        },
        { $unwind: "$author" },
        {
          $lookup: {
            from: "categories",
            localField: "categories",
            foreignField: "_id",
            pipeline: [{ $project: { name: 1 } }],
            as: "categories",
          },
        },
      ],
      pagination: [
        { $count: "total" },
        {
          $addFields: {
            currentPage: params.page,
            totalPages: {
              $ceil: {
                $divide: ["$total", params.limit],
              },
            },
            hasNextPage: {
              $lt: [params.page, { $ceil: { $divide: ["$total", params.limit] } }],
            },
            hasPrevPage: { $gt: [params.page, 1] },
          },
        },
      ],
    },
  });

  return pipeline;
}

export const generateToken = (res: Response, userId: string) => {
  const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "7d" });
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    // secure: process.env.NODE_ENV === "production",
    sameSite:"none"

  
  });
};

export const formatUserResponse = (user: any): UserResponse => ({
  _id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  username: user.username,
  email: user.email,
  role: user.role,
  bio: user.bio,
  website: user.website,
  socialLinks: user.socialLinks,
  isEmailVerified: user.isEmailVerified,
});
