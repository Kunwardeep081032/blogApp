// page that fetches post by id

import Layout from "@/components/Layout";
import LoadingSpinner from "@/components/Loading";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createComment, getAllComments, getPostById, likePost } from "@/helper";
import type { Post } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { ArrowLeft, Heart, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function PostById() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [newComment, setNewComment] = useState("");
    const queryClient = useQueryClient();

    const {
        data: post,
        isLoading: postLoading,
        isError: postError,
        error: postErrorData,
    } = useQuery({
        queryKey: ["post", id],
        queryFn: () => getPostById(id as string),
        enabled: !!id,
    });

    const { data: comments, isLoading: commentsLoading } = useQuery({
        queryKey: ["comments", id],
        queryFn: () => getAllComments(id as string),
        enabled: !!id,
    });

    const likeMutation = useMutation({
        mutationFn: () => likePost(id as string),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["post", id] });
            const previousPost = queryClient.getQueryData<
                Post & { likeStatus: "unliked" | "liked" }
            >(["post", id]);
            if (previousPost) {
                queryClient.setQueryData<Post & { likeStatus: "unliked" | "liked" }>(
                    ["post", id],
                    (old) => {
                        if (!old) return previousPost;
                        return {
                            ...old,
                            likeCount:
                                old.likeStatus === "liked" ? old.likeCount - 1 : old.likeCount + 1,
                            likeStatus: old.likeStatus === "liked" ? "unliked" : "liked",
                        };
                    },
                );
            }
            return { previousPost };
        },
        onError: (_err, _variables, context) => {
            if (context?.previousPost) {
                queryClient.setQueryData(["post", id], context.previousPost);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["post", id] });
        },
    });

    const createCommentMutation = useMutation({
        mutationFn: (content: string) => createComment(id as string, content),
        onSuccess: () => {
            setNewComment("");
            queryClient.invalidateQueries({ queryKey: ["comments", id] });
        },
    });

    const handleLikeClick = () => {
        likeMutation.mutate();
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim()) {
            createCommentMutation.mutate(newComment);
        }
    };

    const isLoading = postLoading || commentsLoading;
    const showError = postError || !post;

    if (isLoading) {
        return (
            <div className="flex h-screen justify-center items-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (showError) {
        return (
            <Layout>
                <div className="container mx-auto px-4 md:px-6 py-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold mb-4 text-destructive">Error</h1>
                        <p className="text-destructive">{(postErrorData as AxiosError).message}</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="px-4 md:px-6 py-8">
                <Button
                    variant="link"
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center text-primary hover:underline mb-4 p-0"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to all posts
                </Button>
                <article className="mx-auto">
                    <h1 className="text-3xl font-bold mb-4 text-foreground">{post.title}</h1>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                        <Avatar>
                            <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
                                {post.author.username[0].toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{post.author.username}</span>
                        <span>•</span>
                        <time
                            dateTime={new Date(post.createdAt).toLocaleString()}
                            className="text-muted-foreground"
                        >
                            {new Date(post.createdAt).toLocaleDateString()}
                        </time>
                    </div>
                    <div
                        dangerouslySetInnerHTML={{ __html: post.content }}
                        className="text-foreground"
                    />
                </article>

                <div className="mt-8">
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={handleLikeClick}
                            disabled={likeMutation.isPending}
                            className={`flex items-center gap-2 ${
                                post.likeStatus === "liked"
                                    ? "text-destructive"
                                    : "text-muted-foreground"
                            } transition-colors duration-200 hover:opacity-80`}
                        >
                            <Heart
                                className={`h-5 w-5 ${
                                    post.likeStatus === "liked" ? "fill-current" : ""
                                }`}
                            />
                            <span className="text-sm font-medium">{post.likeCount} Likes</span>
                        </button>
                        <button className="flex items-center gap-2 text-muted-foreground">
                            <MessageCircle className="h-5 w-5" />
                            <span className="text-sm font-medium">{post.commentsCount}</span>
                        </button>
                    </div>

                    <div className="bg-secondary rounded-lg p-4 mb-6">
                        <form onSubmit={handleCommentSubmit} className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Avatar className="w-8 h-8">
                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                        {post.author.username[0].toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <Textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Write a comment..."
                                    className="flex-1 min-h-[100px] bg-background border-border resize-none"
                                />
                            </div>
                            <div className="flex justify-start pl-11">
                                <Button type="submit" disabled={createCommentMutation.isPending}>
                                    <Send className="mr-2 h-4 w-4" />
                                    {createCommentMutation.isPending
                                        ? "Posting..."
                                        : "Post Comment"}
                                </Button>
                            </div>
                        </form>
                    </div>

                    <div className="space-y-6">
                        {comments?.map((comment) => (
                            <div key={comment._id} className="flex gap-3">
                                <Avatar className="w-8 h-8">
                                    <AvatarFallback className="text-sm font-semibold bg-primary text-primary-foreground">
                                        {comment.author.username[0].toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-foreground">
                                            {comment.author.username}
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-foreground">{comment.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
