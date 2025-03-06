// page to create new page

import Layout from "@/components/Layout";
import Tiptap from "@/components/editor/TipTap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createPost } from "@/helper";
import { type PostForm, postSchema } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { type AxiosError } from "axios";
import { ImagePlus, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function CreatePost() {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        watch,
    } = useForm<PostForm>({
        resolver: zodResolver(postSchema),
    });

    const watchImage = watch("image") as FileList;

    useEffect(() => {
        if (watchImage && watchImage.length > 0) {
            const file = watchImage[0];
            const fileReader = new FileReader();
            fileReader.onload = (e: ProgressEvent<FileReader>) => {
                if (e.target?.result) {
                    setPreviewUrl(e.target.result as string);
                }
            };
            fileReader.readAsDataURL(file);
        }
    }, [watchImage]);

    const { mutate, status } = useMutation({
        mutationFn: async (data: PostForm) => {
            await createPost(data);
        },
        onSuccess: () => {
            toast.success("Post created successfully, redirecting.....");
            setTimeout(() => {
                navigate("/");
            }, 2000);
        },
        onError: (error: unknown) => {
            console.error(error);
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<{ message: string }>;
                toast.error(axiosError.response?.data?.message || "Error creating post");
            } else {
                toast.error("An unexpected error occurred");
            }
        },
    });

    const onSubmit: SubmitHandler<PostForm> = (data) => {
        mutate(data);
    };

    return (
        <Layout>
            <div className="w-full mx-auto px-4 py-8">
                <div className="mb-5">
                    <h2 className="text-3xl font-bold tracking-tight">Create New Blog Post</h2>
                    <p className="text-muted-foreground mt-2">
                        Craft your ideas and share them with the world
                    </p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-lg font-medium">
                            Title
                        </Label>
                        <Input
                            id="title"
                            {...register("title")}
                            placeholder="Enter an engaging title for your post"
                        />
                        {errors.title && (
                            <p className="text-destructive text-sm">{errors.title.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="content" className="text-lg font-medium">
                            Content
                        </Label>
                        <Controller
                            name="content"
                            control={control}
                            render={({ field }) => (
                                <div className="border rounded-md overflow-hidden">
                                    <Tiptap content={field.value} onChange={field.onChange} />
                                </div>
                            )}
                        />
                        {errors.content && (
                            <p className="text-destructive text-sm">{errors.content.message}</p>
                        )}
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="category" className="text-lg font-medium">
                                Category
                            </Label>
                            <Controller
                                name="category"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="technology">Technology</SelectItem>
                                            <SelectItem value="lifestyle">Lifestyle</SelectItem>
                                            <SelectItem value="travel">Travel</SelectItem>
                                            <SelectItem value="food">Food</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.category && (
                                <p className="text-destructive text-sm">
                                    {errors.category.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="image" className="text-lg font-medium">
                                Cover Image
                            </Label>
                            <div className="flex items-center gap-4">
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    {...register("image")}
                                    className="w-full file:bg-transparent file:border-0 file:text-sm file:font-medium hover:file:text-primary cursor-pointer"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            register("image").onChange(e);
                                        }
                                    }}
                                />
                            </div>
                            {errors.image && (
                                <p className="text-destructive text-sm">
                                    {errors.image.message as string}
                                </p>
                            )}
                        </div>
                    </div>
                    {!previewUrl && (
                        <div className="w-full h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                            <ImagePlus className="w-8 h-8 text-gray-400" />
                        </div>
                    )}
                    {previewUrl && (
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="mt-2 max-w-full h-auto rounded-lg shadow-md"
                        />
                    )}
                    <div className="flex justify-end space-x-4 pt-4">
                        <Button type="button" variant="outline">
                            Save Draft
                        </Button>
                        <Button type="submit" disabled={status === "pending"}>
                            {status === "pending" ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Publishing...
                                </>
                            ) : (
                                "Publish Post"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
