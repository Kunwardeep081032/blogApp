// Helper function handling api calls to serve to the query

import type { LoginForm, Post, PostComments, PostForm, SearchParams, SignupForm } from "@/types";
import axios from "axios";

type PostResponse = {
    posts: Post[];
    totalPages: number;
    currentPage: number;
    totalPosts: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
};

export const url = import.meta.env.VITE_API_URL;
export const POSTS_PER_PAGE = 5;
export const POSTS_PER_PAGE_MY_POSTS = 2;

export const getPosts = async (
    page: number,
    limit: number,
    searchParams: SearchParams = {},
): Promise<PostResponse> => {
    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(searchParams.search && { search: searchParams.search }),
        ...(searchParams.searchField && { searchField: searchParams.searchField }),
    });

    const res = await axios.get(`${url}/posts/search?${queryParams}`, {
        withCredentials: true,
    });
    return res.data.data;
};

export const createPost = async (data: PostForm): Promise<Post> => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("category", data.category);
    if (data.image && data.image instanceof FileList && data.image.length > 0) {
        formData.append("image", data.image[0]);
    }

    const res = await axios.post(`${url}/posts`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
    });
    return res.data;
};

export async function getCurrentUserPosts(page: number, limit: number): Promise<PostResponse> {
    const res = await axios.get(`${url}/user/posts`, {
        params: { page, limit },
        withCredentials: true,
    });
    return res.data;
}

export async function getPostById(id: string): Promise<Post & { likeStatus: "unliked" | "liked" }> {
    const res = await axios.get(`${url}/posts/${id}`, {
        withCredentials: true,
    });
    return {
        ...res.data.post,
        likeStatus: res.data.likeStatus,
    };
}

export async function deletePostById(id: string): Promise<void> {
    await axios.delete(`${url}/posts/${id}`, {
        withCredentials: true,
    });
}

export async function updatePostById(id: string, title: string, content: string): Promise<Post> {
    const res = await axios.put(
        `${url}/posts/${id}`,
        {
            title,
            content,
        },
        {
            withCredentials: true,
        },
    );
    return res.data;
}

export async function createComment(postId: string, content: string): Promise<PostComments> {
    const res = await axios.post(
        `${url}/${postId}/comment`,
        { content },
        {
            withCredentials: true,
        },
    );
    return res.data.post;
}

export async function getAllComments(postId: string): Promise<PostComments[]> {
    const res = await axios.get(`${url}/${postId}/comment`, {
        withCredentials: true,
    });
    return res.data.comments;
}

export async function likePost(postId: string): Promise<
    Post & {
        likeStatus: "liked" | "unliked";
    }
> {
    const res = await axios.post(
        `${url}/posts/${postId}/like`,
        {},
        {
            withCredentials: true,
        },
    );
    return res.data;
}

export async function loginUser(data: LoginForm) {
    const response = await axios.post(`${url}/auth/signin`, data, {
        withCredentials: true,
    });
    return response.data;
}

export async function signUpUser(data: SignupForm) {
    const response = await axios.post(`${url}/auth/signup`, data);
    return response.data;
}

export async function verifyEmail(token: string) {
    const response = await axios.get(`${url}/auth/verify/${token}`);
    return response.data;
}
