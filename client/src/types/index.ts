// Typescript(kinda hate it for this extra reason)
// This zod schema for all the possible requests


import { z } from "zod";

export interface Post {
    _id: string;
    title: string;
    content: string;
    author: {
        _id: string;
        username: string;
        firstName?: string;
        lastName?: string;
    };
    categories?: {
        _id: string;
        name: string;
    };
    image: string;
    createdAt: string;
    updatedAt: string;
    views: number;
    status: "draft" | "published" | "archived";
    likeCount: number;
    likes: string[];
    commentsCount: number;
}

export type User = {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    createdAt: string;
    isEmailVerified: boolean;
    emailVerificationToken: string;
    emailVerificationTokenExpiry: string;
};

export type BlogCardProps = {
    _id: string;
    title: string;
    content: string;
    image: string;
    createdAt: string;
    author: {
        _id: string;
        username: string;
    };
};

export type PostComments = {
    _id: string;
    content: string;
    createdAt: string;
    likes: string[];
    likeCount: number;
    post: string;
    author: {
        _id: string;
        username: string;
    };
};

export const signupSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    username: z.string().min(3, "Username must be at least 3 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export type SearchParams = {
    search?: string;
    searchField?: string;
};

export const postSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
    content: z.string().min(10, "Content must be at least 10 characters long"),
    category: z.enum(["technology", "lifestyle", "travel", "food"]),
    image: z
        .any()
        .refine((file) => file?.[0]?.size <= 5000000, {
            message: "Image size must be less than 5MB",
        })
        .refine((file) => ["image/jpeg", "image/png"].includes(file?.[0]?.type), {
            message: "Image must be either JPEG or PNG",
        }),
});

export type PostForm = z.infer<typeof postSchema>;
export type SignupForm = z.infer<typeof signupSchema>;
export type LoginForm = z.infer<typeof loginSchema>;
