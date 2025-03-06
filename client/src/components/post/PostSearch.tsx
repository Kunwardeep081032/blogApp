// The whole search the post logic

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
import { useEffect, useState } from "react";

interface SearchFilters {
    search: string;
    searchField: string;
}

interface PostSearchProps {
    initialFilters: SearchFilters;
    onSearch: (filters: SearchFilters) => void;
}

const searchFieldOptions = [
    { id: "title", label: "Title" },
    { id: "content", label: "Content" },
    { id: "author", label: "Author" },
    //TODO: add tags
    //   { id: "tags", label: "Tags" },
];

export function PostSearch({ initialFilters, onSearch }: PostSearchProps) {
    const [filters, setFilters] = useState<SearchFilters>(initialFilters);

    useEffect(() => {
        setFilters(initialFilters);
    }, [initialFilters]);

    const handleSearch = () => {
        onSearch(filters);
    };

    const handleReset = () => {
        const defaultFilters = {
            search: "",
            searchField: "title",
        };
        setFilters(defaultFilters);
        onSearch(defaultFilters);
    };

    return (
        <div className="">
            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="search" className="text-sm font-medium">
                        Search
                    </Label>
                    <Input
                        id="search"
                        placeholder="Search posts..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        className="h-10"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-medium">Filter</Label>
                    <Select
                        value={filters.searchField}
                        onValueChange={(value) => setFilters({ ...filters, searchField: value })}
                    >
                        <SelectTrigger className="h-10">
                            <SelectValue placeholder="Select field" />
                        </SelectTrigger>
                        <SelectContent>
                            {searchFieldOptions.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
                <Button variant="outline" onClick={handleReset} className="h-10 px-6">
                    Reset
                </Button>
                <Button
                    onClick={handleSearch}
                    className="h-10 px-6 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                    Search
                </Button>
            </div>
        </div>
    );
}
