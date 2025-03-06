// page to show all your posts

import Layout from "@/components/Layout";
import LoadingSpinner from "@/components/Loading";
import Tiptap from "@/components/editor/TipTap";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    POSTS_PER_PAGE_MY_POSTS,
    deletePostById,
    getCurrentUserPosts,
    updatePostById,
} from "@/helper";
import type { Post } from "@/types";
import { stripHtmlAndTruncate } from "@/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ChevronLeft, ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function MyPosts() {
    const navigate = useNavigate();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState<string>();
    const [postToEdit, setPostToEdit] = useState<Post | null>();
    const [currentPage, setCurrentPage] = useState(1);

    const { control, handleSubmit, setValue, reset } = useForm({
        defaultValues: {
            title: "",
            content: "",
        },
    });

    const {
        data,
        isLoading,
        refetch: fetchPosts,
    } = useQuery({
        queryKey: ["posts", currentPage],
        queryFn: () => getCurrentUserPosts(currentPage, POSTS_PER_PAGE_MY_POSTS),
    });

    const { mutate: deletePost, isPending: isDeleting } = useMutation({
        mutationFn: async (postId: string) => {
            await deletePostById(postId);
        },
        onSuccess: () => {
            toast.success("Post deleted successfully");
            setIsDeleteDialogOpen(false);
            setPostToDelete("");
            fetchPosts();
        },
        onError: (error: unknown) => {
            if (error instanceof AxiosError) {
                toast.error("Error deleting post");
            }
        },
    });

    const { mutate: updatePost, isPending: isUpdating } = useMutation({
        mutationFn: async (data: { title: string; content: string; postId: string }) => {
            await updatePostById(data.postId, data.title, data.content);
        },
        onSuccess: () => {
            toast.success("Post updated successfully");
            setIsEditDialogOpen(false);
            setPostToEdit(null);
            reset();
            fetchPosts();
        },
        onError: (error: unknown) => {
            if (error instanceof AxiosError) {
                toast.error("Error updating post");
            }
        },
    });

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= (data?.totalPages ?? 0)) {
            setCurrentPage(newPage);
        }
    };

    const openDeleteDialog = (postId: string) => {
        setPostToDelete(postId);
        setIsDeleteDialogOpen(true);
    };

    const openEditDialog = (post: Post) => {
        setPostToEdit(post);
        setValue("title", post.title);
        setValue("content", post.content);
        setIsEditDialogOpen(true);
    };

    const handleDelete = () => {
        if (postToDelete) {
            deletePost(postToDelete);
        }
    };

    const handleEdit = (data: { title: string; content: string }) => {
        if (postToEdit) {
            updatePost({ ...data, postId: postToEdit._id });
        }
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="flex h-[calc(100vh-4rem)] justify-center items-center">
                    <LoadingSpinner />
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="px-4 md:px-6 py-4 md:py-8">
                <header className="mb-4 md:mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold mb-4">My Blog Posts</h1>
                    <div className="flex justify-end items-center">
                        <Button
                            onClick={() => navigate("/create/post")}
                            className="w-full sm:w-auto"
                        >
                            <Plus className="mr-2 h-4 w-4" /> New Post
                        </Button>
                    </div>
                </header>
                <main>
                    {data?.posts.length === 0 ? (
                        <p className="text-center text-gray-500 my-8">
                            No posts found. Create a new post to get started!
                        </p>
                    ) : (
                        <div className="grid gap-4 md:gap-6">
                            {data?.posts.map((post) => (
                                <Card key={post._id}>
                                    <CardHeader>
                                        <CardTitle className="text-xl md:text-2xl">
                                            {post.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-xs md:text-sm text-gray-500 mb-1 -mt-3">
                                            Published on{" "}
                                            {new Date(post.createdAt).toLocaleDateString()}
                                        </p>
                                        <p className="text-sm md:text-base text-gray-700 line-clamp-2">
                                            {stripHtmlAndTruncate(post.content)}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                        <div className="flex gap-2 w-full sm:w-auto">
                                            <Button
                                                variant="outline"
                                                onClick={() => openEditDialog(post)}
                                                className="flex-1 sm:flex-none"
                                            >
                                                <Pencil className="mr-2 h-4 w-4" /> Edit
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => openDeleteDialog(post._id)}
                                                className="flex-1 sm:flex-none"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                            </Button>
                                        </div>
                                        <Link to={`/post/${post._id}`} className="w-full sm:w-auto">
                                            <Button variant="link" className="w-full sm:w-auto">
                                                Read More
                                            </Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                    {data?.totalPages && data?.totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-4 mt-8 mb-12">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                <span className="sr-only">Previous page</span>
                            </Button>
                            <div className="text-sm font-medium">
                                Page {currentPage} of {data.totalPages}
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === data.totalPages}
                            >
                                <ChevronRight className="h-4 w-4" />
                                <span className="sr-only">Next page</span>
                            </Button>
                        </div>
                    )}
                </main>
            </div>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Are you sure you want to delete this post?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete your post.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[800px] h-[90vh] md:h-[80vh] flex flex-col">
                    <form onSubmit={handleSubmit(handleEdit)} className="flex flex-col h-full">
                        <DialogHeader>
                            <DialogTitle>Edit Post</DialogTitle>
                            <DialogDescription>
                                Make changes to your post here. Click save when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4 px-2 flex-grow overflow-hidden">
                            <div className="grid items-start gap-2">
                                <label htmlFor="title" className="text-sm font-medium">
                                    Title
                                </label>
                                <Controller
                                    name="title"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            id="title"
                                            {...field}
                                            placeholder="Enter post title"
                                            className="col-span-3"
                                        />
                                    )}
                                />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="content" className="text-sm font-medium">
                                    Content
                                </label>
                                <Controller
                                    name="content"
                                    control={control}
                                    render={({ field }) => (
                                        <Tiptap
                                            content={field.value}
                                            onChange={field.onChange}
                                            className="h-[40vh] md:h-[50vh] w-full"
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsEditDialogOpen(false);
                                    reset();
                                }}
                                className="mt-2 sm:mt-0"
                            >
                                Cancel
                            </Button>
                            <Button type="submit" className="mt-2 sm:mt-0" disabled={isUpdating}>
                                {isUpdating ? "Saving..." : "Save changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </Layout>
    );
}
