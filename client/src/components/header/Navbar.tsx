// Navbar component


import ModeToggle from "@/components/header/ModeToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/context/useAuth";
import axios from "axios";
import { Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Navbar() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/auth/signout`, {
                withCredentials: true,
            });
            toast.success("Logged out successfully");
            setUser(null);
            navigate("/auth/login");
        } catch (_error) {
            console.log(_error)
            toast.error("Failed to log out");
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="px-5 md:px-0 flex h-14 items-center">
                <MainNav />
                <MobileNav />
                <div className="flex flex-1 items-center justify-end space-x-4">
                    <nav className="flex items-center space-x-2">
                        <ModeToggle />
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Avatar className="h-8 w-8 cursor-pointer">
                                        <AvatarFallback className="bg-primary text-primary-foreground">
                                            {user.firstName?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                                        Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleLogout}>
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button
                                className="h-8 rounded-full"
                                onClick={() => navigate("/auth/login")}
                            >
                                Sign In
                            </Button>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}

function MainNav() {
    return (
        <div className="mr-4 hidden md:flex">
            <Link to="/" className="mr-6 flex items-center space-x-2">
                <span className="font-bold text-lg">WriteUp</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
                <Link
                    to="/"
                    className="transition-colors hover:text-foreground/80 text-foreground/60"
                >
                    Home
                </Link>
                <Link
                    to="/posts"
                    className="transition-colors hover:text-foreground/80 text-foreground/60"
                >
                    Explore
                </Link>
                <Link
                    to="/user/post"
                    className="transition-colors hover:text-foreground/80 text-foreground/60"
                >
                    My Posts
                </Link>
                <Link
                    to="/create/post"
                    className="transition-colors hover:text-foreground/80 text-foreground/60"
                >
                    Create Post
                </Link>
            </nav>
        </div>
    );
}

function MobileNav() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                >
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4">
                    <Link to="/" className="flex items-center">
                        <span className="font-bold text-lg">WriteUp</span>
                    </Link>
                    <Link
                        to="/"
                        className="transition-colors hover:text-foreground/80 text-foreground/60"
                    >
                        Home
                    </Link>
                    <Link
                        to="/posts"
                        className="transition-colors hover:text-foreground/80 text-foreground/60"
                    >
                        Explore
                    </Link>
                    <Link
                        to="/user/post"
                        className="transition-colors hover:text-foreground/80 text-foreground/60"
                    >
                        My Posts
                    </Link>
                    <Link
                        to="/create/post"
                        className="transition-colors hover:text-foreground/80 text-foreground/60"
                    >
                        Create Post
                    </Link>
                </nav>
            </SheetContent>
        </Sheet>
    );
}
