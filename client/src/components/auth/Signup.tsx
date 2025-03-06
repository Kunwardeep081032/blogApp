//signup page

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpUser } from "@/helper";
import { type SignupForm, signupSchema } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Signup() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupForm>({
        resolver: zodResolver(signupSchema),
    });

    const { mutate, isPending } = useMutation({
        mutationFn: signUpUser,
        onSuccess: () => {
            toast.success("Account created successfully, redirecting.....");
            setTimeout(() => {
                navigate("/auth/login");
            }, 2000);
        },
        onError: (_error) => {
            if (_error instanceof AxiosError) {
                toast.error(_error.response?.data?.error || "An error occurred, please try again");
            } else {
                toast.error("An unexpected error occurred");
            }
        },
    });

    const onSubmit = (data: SignupForm) => {
        mutate(data);
    };

    return (
        <section className="h-screen flex justify-center items-center">
            <Card className="mx-auto max-w-sm">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle className="text-xl">Sign Up</CardTitle>
                        <CardDescription>
                            Enter your information to create an account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="first-name">First name</Label>
                                    <Input
                                        id="first-name"
                                        placeholder="Max"
                                        {...register("firstName")}
                                    />
                                    {errors.firstName && (
                                        <p className="text-red-500 text-sm">
                                            {errors.firstName.message}
                                        </p>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="last-name">Last name</Label>
                                    <Input
                                        id="last-name"
                                        placeholder="Robinson"
                                        {...register("lastName")}
                                    />
                                    {errors.lastName && (
                                        <p className="text-red-500 text-sm">
                                            {errors.lastName.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    placeholder="maxrobinson"
                                    {...register("username")}
                                />
                                {errors.username && (
                                    <p className="text-red-500 text-sm">
                                        {errors.username.message}
                                    </p>
                                )}
                            </div>
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
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" {...register("password")} />
                                {errors.password && (
                                    <p className="text-red-500 text-sm">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>
                            <Button type="submit" className="w-full" disabled={isPending}>
                                {isPending ? "Creating Account..." : "Create an account"}
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Already have an account?{" "}
                            <Link to={"/auth/login"} className="underline">
                                Sign in
                            </Link>
                        </div>
                    </CardContent>
                </form>
            </Card>
        </section>
    );
}
