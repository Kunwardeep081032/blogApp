// Dropdown menu for the Navbar component

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/useAuth";
import type { User } from "@/types";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

export default function DropDownMenu({ user }: { user: User }) {
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const handleLogout = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/signout`, {
                withCredentials: true,
            });
            if (res.status === 200) {
                toast.success("Logged out successfully");
                setUser(null);
                await new Promise((resolve) => setTimeout(resolve, 2000));
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                        {user?.firstName?.split("")[0].toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-sm" side="bottom" align="end" sideOffset={20}>
                <DropdownMenuItem onClick={() => navigate("/user/post")}>My Posts</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/")}>Explore</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/create/post")}>
                    Create Post
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleLogout()}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
