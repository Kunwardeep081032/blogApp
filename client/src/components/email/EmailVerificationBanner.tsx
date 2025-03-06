// The email verification banner for non-verified users
// Presents when a user is trying to access a route wrapped in protected component, and the user email is not email verified.

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/useAuth";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

export function EmailVerificationBanner() {
    const { user } = useAuth();
    const location = useLocation();
    const {
        handleSubmit,
        formState: { isSubmitting },
    } = useForm();

    if (user?.isEmailVerified) return null;

    const onSubmit = async () => {
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/auth/resend-verification?callbackUrl=${location.pathname}`,
                {},
                { withCredentials: true },
            );
            toast.success("Verification email sent successfully");
        } catch (_error) {
            console.log(_error)
            toast.error("Failed to send verification email");
        }
    };

    return (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
                <div className="flex-1">
                    <p className="text-sm text-yellow-700">
                        Please verify your email address to create posts.
                    </p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Button type="submit" variant="outline" size="sm" disabled={isSubmitting}>
                        {isSubmitting ? "Sending..." : "Resend Verification Email"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
