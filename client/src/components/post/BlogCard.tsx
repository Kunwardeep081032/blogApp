// Blog card

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import type { BlogCardProps } from "@/types";
import calculateReadingTime, { stripHtmlAndTruncate } from "@/utils";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function BlogCard({ post }: { post: BlogCardProps }) {
    const readingTime = calculateReadingTime(post.content, 0);

    return (
        <Card className="overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
            {post.image && (
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                </div>
            )}
            <CardHeader className="p-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
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
                    <Badge variant="secondary" className="flex items-center space-x-1">
                        <ClockIcon className="h-3 w-3" />
                        <span>{readingTime.text}</span>
                    </Badge>
                </div>
                <Link
                    to={`/post/${post._id}`}
                    className="text-xl font-semibold hover:text-primary transition-colors duration-200"
                >
                    {post.title}
                </Link>
            </CardHeader>
            <CardContent className="p-4">
                <p className="text-muted-foreground line-clamp-3">
                    {stripHtmlAndTruncate(post.content)}
                </p>
            </CardContent>
            {post.author && (
                <CardFooter className="p-4 bg-muted/50">
                    <div className="flex items-center space-x-3">
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
                </CardFooter>
            )}
        </Card>
    );
}
