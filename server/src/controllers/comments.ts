// Comment controller

import type { Request, Response } from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";
import { Comment, Post } from "../models";
import { handleControllerError } from "../utils/helper";
import { commentSchema } from "../validators";

export async function createComment(req: Request, res: Response) {
  try {
    const { content } = commentSchema.parse(req.body);
    const { postId } = req.params;
    const authorId = req.user.id;

    const post = await Post.findById(postId);

    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    const newComment = await Comment.create({
      content,
      post: postId,
      author: authorId,
    });

    post.comments.push(newComment._id);
    post.commentsCount += 1;
    await post.save();

    res.status(201).json({
      message: "Comment created successfully",
      comment: newComment,
    });
  } catch (error: any) {
    handleControllerError(error, res);
  }
}

export async function getAllComments(req: Request, res: Response) {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId }).populate("author", "username");

    res.status(200).json({ comments });
  } catch (error: any) {
    handleControllerError(error, res);
  }
}

export async function likeComment(req: Request, res: Response) {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);

    if (!comment) {
      res.status(404).json({ error: "Comment not found" });
      return;
    }

    const authorId = new mongoose.Types.ObjectId(req.user.id);
    if (!comment.likes.includes(authorId)) {
      comment.likes.push(authorId);
      comment.likeCount += 1;
      await comment.save();
    } else {
      const index = comment.likes.indexOf(authorId);
      comment.likes.splice(index, 1);
      comment.likeCount = comment.likes.length;
      await comment.save();
    }

    const likeStatus = comment.likes.includes(authorId) ? "liked" : "unliked";

    res.status(200).json({
      comment,
      likeStatus,
    });
  } catch (error: any) {
    handleControllerError(error, res);
  }
}

export async function deleteComment(req: Request, res: Response) {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);

    if (!comment || !comment.author) {
      res.status(404).json({ error: "Comment not found" });
      return;
    }

    if (comment.author.toString() !== req.user.id) {
      res.status(403).json({ error: "You are not authorized to delete this comment" });
      return;
    }

    await Comment.findByIdAndDelete(commentId);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error: any) {
    handleControllerError(error, res);
  }
}

// export async function updateComment(req: Request, res: Response) {
//   try {
//     const { commentId } = req.params;
//     const { content } = commentSchema.parse(req.body);
//     const comment = await Comment.findById(commentId);

//     if (!comment || !comment.author) {
//       res.status(404).json({ error: "Comment not found" });
//       return;
//     }

//     if (comment.author.toString() !== req.user.id) {
//       res
//         .status(403)
//         .json({ error: "You are not authorized to update this comment" });
//       return;
//     }

//     const updatedComment = await Comment.findByIdAndUpdate(
//       commentId,
//       { content },
//       { new: true }
//     );

//     res.status(200).json({ comment: updatedComment });
//   } catch (error: any) {
//     if (error instanceof ZodError) {
//       res.status(400).json({ error: error.errors });
//     } else {
//       res.status(500).json({ error: error.message });
//     }
//   }
// }
