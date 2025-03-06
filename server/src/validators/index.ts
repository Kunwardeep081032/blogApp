// Zod validation schemas

import { z } from "zod";

export const userSchema = z.object({
  firstName: z.string().min(3).max(255),
  lastName: z.string().min(3).max(255),
  username: z.string().min(3).max(255),
  email: z.string().email(),
  password: z.string().min(6).max(255),
  bio: z.string().optional(),
  website: z.string().optional(),
  socialLinks: z
    .object({
      twitter: z.string().optional(),
      instagram: z.string().optional(),
      linkedin: z.string().optional(),
    })
    .optional(),
  role: z.enum(["admin", "user"]).optional().default("user"),
  isEmailVerified: z.boolean().optional().default(false),
});

export const postSchema = z.object({
  title: z.string().min(3).max(255),
  content: z.string().min(3),
});

export const commentSchema = z.object({
  content: z.string().min(2),
  postId: z.string().uuid().optional(),
  parentCommentId: z.string().uuid().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

export const searchQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  search: z.string().optional(),
  searchField: z.enum(["title", "content", "author", "tags"]).optional(),
  category: z.string().optional(),
  author: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  sortBy: z.string().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  minLikes: z.coerce.number().optional(),
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type ValidatedSearchQuery = z.infer<typeof searchQuerySchema>;
export type commentSchemaType = z.infer<typeof commentSchema>;
export type postSchemaType = z.infer<typeof postSchema>;
export type userSchemaType = z.infer<typeof userSchema>;
