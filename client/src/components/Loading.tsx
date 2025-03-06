// When state is loading this bad boy enters the chat hahaha

import { cn } from "@/lib/utils";

export default function LoadingSpinner({
    size = "md",
    className,
}: {
    size?: "sm" | "md" | "lg";
    className?: string;
}) {
    return (
        <div
            className={cn(
                "inline-block animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]",
                {
                    "h-4 w-4": size === "sm",
                    "h-8 w-8": size === "md",
                    "h-12 w-12": size === "lg",
                },
                className,
            )}
        >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
            </span>
        </div>
    );
}
