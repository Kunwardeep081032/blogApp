// Layout pseudo-HOC for the whole app

import Navbar from "@/components/header/Navbar";
import { Toaster } from "sonner";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto flex flex-col">
            <Navbar />
            <main className="flex-grow px-2">{children}</main>
            <footer className="border-t py-4 mt-4">
                <div className="container mx-auto text-center text-sm">
                    © {new Date().getFullYear()} WriteUp. All rights reserved.
                </div>
            </footer>
            <Toaster />
        </div>
    );
}
