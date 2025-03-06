//Login Page

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/useAuth";
import { loginUser } from "@/helper";
import { type LoginForm, loginSchema } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";

export default function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const navigate = useNavigate();
    const { user, setUser } = useAuth();

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    const { mutate, isPending } = useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            setUser(data.user);
            toast.success("Login successful, redirecting.....");
            setTimeout(() => {
                navigate("/");
            }, 2000);
        },
        onError: (error: Error) => {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.error || "Login failed");
            } else {
                toast.error("An unexpected error occurred");
            }
        },
    });

    const onSubmit = (data: LoginForm) => {
        mutate(data);
    };

    return (
        <section className="h-screen flex justify-center items-center">
            <Card className="mx-auto max-w-sm">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle className="text-2xl">Login</CardTitle>
                        <CardDescription>
                            Enter your email below to login to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    {...register("email")}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <span className="ml-auto inline-block text-sm underline">
                                        Forgot your password?
                                    </span>
                                </div>
                                <Input id="password" type="password" {...register("password")} />
                                {errors.password && (
                                    <p className="text-red-500 text-sm">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>
                            <Button type="submit" className="w-full" disabled={isPending}>
                                {isPending ? "Logging in..." : "Login"}
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            <Link to="/auth/signup">Don&apos;t have an account? Sign up</Link>
                        </div>
                    </CardContent>
                </form>
            </Card>
            <Toaster />
        </section>
    );
}
