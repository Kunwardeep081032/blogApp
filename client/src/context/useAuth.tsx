// Custom hook for handling auth context, the initial fetch, the user data and all things related to auth

import LoadingSpinner from "@/components/Loading";
import type { User } from "@/types";
import axios, { AxiosError } from "axios";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextProps = {
    user: User | null;
    loading: boolean;
    error: Error | null;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<AxiosError | null>(null);

    const fetchUser = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, {
                withCredentials: true,
            });

            if (res.data) {
                setUser(res.data.user);
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, error, isAuthenticated: !!user, setUser }}>
            {loading ? (
                <div className="flex h-screen justify-center items-center">
                    <LoadingSpinner className={""} />
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
