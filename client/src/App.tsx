// App entry point

import Layout from "@/components/Layout";
import BlogCard from "@/components/post/BlogCard";
import FeaturedPost from "@/components/post/FeaturedPost";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { POSTS_PER_PAGE, getPosts } from "@/helper/index";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useState } from "react";

export default function App() {
    const [currentPage, setCurrentPage] = useState(1);
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["posts", currentPage],
        queryFn: () => getPosts(currentPage, POSTS_PER_PAGE),
    });

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= (data?.totalPages ?? 0)) {
            setCurrentPage(newPage);
        }
    };

    const featuredPost = data?.posts[0];
    const recentPosts = data?.posts.slice(1);
    const hasNoPosts = !isLoading && !isError && (!data?.posts || data.posts.length === 0);
    const hasOnlyOnePost = !isLoading && !isError && data?.posts?.length === 1;
    const showPagination = !isLoading && !isError && data?.totalPages && data.totalPages > 1;

    return (
        <Layout>
            <div className="flex flex-col min-h-screen space-y-8 py-8">
                {isLoading && (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    </div>
                )}

                {isError && (
                    <div className="text-red-500 text-center my-8 p-4 bg-red-100/10 rounded-lg border border-red-500/20">
                        <p className="text-lg font-semibold">Oops! Something went wrong.</p>
                        <p className="text-sm mt-2">
                            {error instanceof Error ? error.message : "Failed to fetch posts"}
                        </p>
                    </div>
                )}

                {hasNoPosts && (
                    <Alert className="max-w-2xl mx-auto">
                        <AlertDescription>
                            No posts found. Check back later for new content!
                        </AlertDescription>
                    </Alert>
                )}

                {!isLoading && !isError && featuredPost && (
                    <>
                        <section>
                            <h2 className="text-2xl font-semibold mb-4">
                                {hasOnlyOnePost ? "Latest Post" : "Featured"}
                            </h2>
                            <FeaturedPost post={featuredPost} />
                        </section>

                        {!hasOnlyOnePost && recentPosts && recentPosts.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-semibold mb-4">Recent Posts</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {recentPosts.map((post) => (
                                        <BlogCard key={post._id} post={post} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                )}

                {showPagination && (
                    <div className="bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t pt-4">
                        <div className="container flex justify-center items-center space-x-4">
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
                    </div>
                )}
            </div>
        </Layout>
    );
}
