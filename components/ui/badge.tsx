import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "secondary" | "outline" | "todo" | "doing" | "done";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
    return (
        <div
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2",
                {
                    "border-transparent bg-gray-900 text-gray-50 hover:bg-gray-900/80": variant === "default",
                    "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-100/80": variant === "secondary",
                    "text-gray-950": variant === "outline",
                    "border-transparent bg-yellow-100 text-yellow-800": variant === "todo",
                    "border-transparent bg-[#85929E]/10 text-[#24292E]": variant === "doing",
                    "border-transparent bg-[#4A6E91]/10 text-[#4A6E91]": variant === "done",
                },
                className
            )}
            {...props}
        />
    )
}

export { Badge }
