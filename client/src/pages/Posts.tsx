// page that have all your posts

import Layout from "@/components/Layout";
import BlogCard from "@/components/post/BlogCard";
import { PostSearch } from "@/components/post/PostSearch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { POSTS_PER_PAGE, getPosts } from "@/helper/index";
import type { Post, SearchParams } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";

export default function Posts() {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;

    const searchFilters = {
        search: searchParams.get("search") || "",
        searchField: searchParams.get("searchField") || "title",
    };

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["posts", searchParams.toString()],
        queryFn: () => getPosts(currentPage, POSTS_PER_PAGE, searchFilters),
    });

    const handleSearch = (filters: SearchParams) => {
        const newParams = new URLSearchParams();
        newParams.set("page", "1");
        if (filters.search) newParams.set("search", filters.search);
        if (filters.searchField) newParams.set("searchField", filters.searchField);
        setSearchParams(newParams);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= (data?.totalPages ?? 0)) {
            searchParams.set("page", newPage.toString());
            setSearchParams(searchParams);
        }
    };

    const hasNoPosts = !isLoading && !isError && (!data?.posts || data.posts.length === 0);
    const showPosts = !isLoading && !isError && data?.posts && data.posts.length > 0;
    const showPagination = !isLoading && !isError && data?.totalPages && data.totalPages > 1;

    return (
        <Layout>
            <div className="flex flex-col min-h-screen space-y-8 py-8">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight">Search Posts</h2>
                    <p className="text-muted-foreground">
                        Find the content you're looking for using our advanced search.
                    </p>
                </div>

                <PostSearch
                    initialFilters={{
                        search: searchFilters.search,
                        searchField: searchFilters.searchField,
                    }}
                    onSearch={handleSearch}
                />

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

                {showPosts && (
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">All Posts</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {data.posts.map((post: Post) => (
                                <BlogCard key={post._id} post={post} />
                            ))}
                        </div>
                    </section>
                )}

                {showPagination && (
                    <div className="py-4">
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
