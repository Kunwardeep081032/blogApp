// Protected component for routes where login is must
import { EmailVerificationBanner } from "@/components/email/EmailVerificationBanner";
import { useAuth } from "@/context/useAuth";

interface ProtectedProps {
    children: React.ReactNode;
    fallBack: React.ReactNode;
    requireVerified?: boolean;
}

export default function Protected({ children, fallBack, requireVerified = false }: ProtectedProps) {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) return fallBack;
    if (requireVerified && !user?.isEmailVerified) {
        return <EmailVerificationBanner />;
    }

    return children;
}
