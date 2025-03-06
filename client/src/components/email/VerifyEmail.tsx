// Component for user to see when it clicks on the link sent in email.
// If user sees this it marks the email has been verified

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { verifyEmail } from "@/helper";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function VerifyEmail() {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();

    const { status } = useQuery({
        queryKey: ["verifyEmail", token],
        queryFn: () => verifyEmail(token as string),
    });

    return (
        <div className="h-dvh flex items-center justify-center">
            {status === "pending" && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">
                            Verifying Your Email
                        </CardTitle>
                        <CardDescription className="text-center">
                            Please wait while we confirm your email address.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Loader2 className="h-16 w-16 animate-spin text-primary" />
                    </CardContent>
                </Card>
            )}

            {status === "success" && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center text-green-600">
                            Email Verified Successfully
                        </CardTitle>
                        <CardDescription className="text-center">
                            Your email has been verified. You can now access all features of the
                            application.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button onClick={() => navigate("/")}>Go to Home</Button>
                    </CardFooter>
                </Card>
            )}

            {status === "error" && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center text-red-600">
                            Verification Failed
                        </CardTitle>
                        <CardDescription className="text-center">
                            We couldn't verify your email. The link may have expired or is invalid.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="float-right">
                        <Button onClick={() => navigate("/")}>Go to Home</Button>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}
