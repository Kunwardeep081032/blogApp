// The featured post to show on the home page of the app

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { BlogCardProps } from "@/types";
import { stripHtmlAndTruncate } from "@/utils";
import { CalendarIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function FeaturedPost({ post }: { post: BlogCardProps }) {
    return (
        <div className="relative group rounded-3xl border bg-card overflow-hidden transition-all">
            {post.image && (
                <div className="relative h-[400px] overflow-hidden">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-background/20" />
                </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                    <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-4 w-4" />
                        <time dateTime={post.createdAt}>
                            {new Date(post.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            })}
                        </time>
                    </div>
                </div>
                <Link
                    to={`/post/${post._id}`}
                    className="block group-hover:text-primary transition-colors"
                >
                    <h3 className="text-2xl font-bold mb-2">{post.title}</h3>
                    <p className="text-muted-foreground line-clamp-2">
                        {stripHtmlAndTruncate(post.content)}
                    </p>
                </Link>
                {post.author && (
                    <div className="flex items-center space-x-3 mt-4">
                        <Avatar className="h-10 w-10">
                            <AvatarImage
                                src={`https://avatar.vercel.sh/${post.author.username}`}
                                alt={post.author.username}
                            />
                            <AvatarFallback>{post.author.username[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium">{post.author.username}</p>
                            <p className="text-xs text-muted-foreground">Author</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
