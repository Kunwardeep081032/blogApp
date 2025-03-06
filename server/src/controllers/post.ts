// Post Controller

import type { Request, Response } from "express";
import mongoose from "mongoose";
import type { PipelineStage } from "mongoose";
import { z } from "zod";
import { uploadOnCloudinary } from "../config/cloudinary";
import { Post } from "../models";
import type { PaginationQuery } from "../types";
import ApiError from "../utils/apiError";
import { buildAggregationPipeline, buildSearchQuery, handleControllerError } from "../utils/helper";
import { type ValidatedSearchQuery, postSchema, type postSchemaType, searchQuerySchema } from "../validators";

interface SearchQuery extends PaginationQuery {
  search?: string;
  category?: string;
  author?: string;
  status?: "draft" | "published" | "archived";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  startDate?: string;
  endDate?: string;
  minLikes?: string;
}

export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content } = postSchema.parse(req.body);
    const author = req.user.id;
    let imageUrl = null;
    let publicId = null;

    if (req.file) {
      const result = await uploadOnCloudinary(req.file.buffer, req.file.originalname);
      if (!result) {
        throw new ApiError(400, "Failed to upload image");
      }
      imageUrl = result.secure_url;
      publicId = result.public_id;
    }

    const post = await Post.create({
      title,
      content,
      image: imageUrl,
      imagePublicId: publicId,
      author,
    });

    const populatedPost = await Post.findById(post._id)
      .populate("author", "username firstName lastName")
      .populate("categories", "name");

    res.status(201).json({
      success: true,
      post: populatedPost,
    });
  } catch (error) {
    handleControllerError(error, res);
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: postSchemaType & {
      image?: string;
      imagePublicId?: string;
    } = postSchema.parse(req.body);

    const existingPost = await Post.findById(id);
    if (!existingPost) {
      throw new ApiError(404, "Post not found");
    }

    // Check if user is author or admin
    if (!existingPost.author || (existingPost.author.toString() !== req.user.id && req.user.role !== "admin")) {
      throw new ApiError(403, "Not authorized to update this post");
    }

    if (req.file) {
      const result = await uploadOnCloudinary(req.file.buffer, req.file.originalname);
      if (!result) {
        throw new ApiError(400, "Failed to upload image");
      }
      updateData.image = result.secure_url;
      updateData.imagePublicId = result.public_id;
    }

    const updatedPost = await Post.findByIdAndUpdate(id, { ...updateData, updatedAt: new Date() }, { new: true })
      .populate("author", "username firstName lastName")
      .populate("categories", "name");

    res.status(200).json({
      success: true,
      post: updatedPost,
    });
  } catch (error) {
    handleControllerError(error, res);
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      throw new ApiError(404, "Post not found");
    }

    if (!post.author || (post.author.toString() !== req.user.id && req.user.role !== "admin")) {
      throw new ApiError(403, "Not authorized to delete this post");
    }

    //TODO: delete image from cloudinary if exists
    // if (post.imagePublicId) {
    //   await deleteFromCloudinary(post.imagePublicId);
    // }

    await Post.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    handleControllerError(error, res);
  }
};

export const getUserPosts = async (req: Request<{}, {}, {}, PaginationQuery>, res: Response) => {
  try {
    if (!req.query.page || !req.query.limit) {
      res.status(400).json({ error: "Please provide page and limit query parameters" });
      return;
    }

    const page = Number.parseInt(req.query.page) || 1;
    const limit = Number.parseInt(req.query.limit) || 10;
    const skipIndex = (page - 1) * limit;

    const totalPosts = await Post.countDocuments({ author: req.user.id });
    const totalPages = Math.ceil(totalPosts / limit);

    const posts = await Post.find({ author: req.user.id })
      .populate("author", "username")
      .sort({ createdAt: -1 })
      .skip(skipIndex)
      .limit(limit);

    res.status(200).json({
      posts,
      currentPage: page,
      totalPages,
      totalPosts,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getPost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "username");
    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    const postLikedByUser = post.likes.map((like) => like.toString());
    const isCurrentUserLikePost = postLikedByUser.includes(req.user.id);

    res.status(200).json({
      post,
      likeStatus: isCurrentUserLikePost ? "liked" : "unliked",
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const likePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      throw new ApiError(404, "Post not found");
    }

    const userLikeIndex = post.likes.findIndex((id) => id.toString() === userId);

    if (userLikeIndex === -1) {
      post.likes.push(new mongoose.Types.ObjectId(userId));
      post.likeCount = post.likes.length;
    } else {
      post.likes.splice(userLikeIndex, 1);
      post.likeCount = post.likes.length;
    }

    await post.save();

    const updatedPost = await Post.findById(postId).populate("author", "username firstName lastName");

    res.status(200).json({
      success: true,
      post: updatedPost,
      likeStatus: userLikeIndex === -1 ? "liked" : "unliked",
    });
  } catch (error) {
    handleControllerError(error, res);
  }
};

export const searchPosts = async (req: Request<{}, {}, {}, ValidatedSearchQuery>, res: Response) => {
  try {
    console.log("Search endpoint hit");
    console.log("Query params:", req.query);

    const validatedQuery = searchQuerySchema.parse(req.query);

    const query = buildSearchQuery(validatedQuery);
    const aggregationPipeline = buildAggregationPipeline(query, validatedQuery);
    const [results] = await Post.aggregate(aggregationPipeline);

    const response = {
      success: true,
      data: {
        posts: results?.posts || [],
        pagination: results?.pagination || {
          currentPage: validatedQuery.page,
          totalPages: 0,
          totalPosts: 0,
          hasNextPage: false,
          hasPrevPage: validatedQuery.page > 1,
        },
      },
    };

    res.status(200).json(response);
  } catch (error) {
    handleControllerError(error, res);
  }
};
