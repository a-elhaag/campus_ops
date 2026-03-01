import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "glass" | "outline" | "ghost";
    size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#9D4EDD] disabled:pointer-events-none disabled:opacity-50",
                    {
                        "neo-vibrant text-white rounded-[2rem]": variant === "default",
                        "neo-flat text-gray-700 rounded-[2rem] active:neo-pressed active:shadow-none hover:text-gray-900": variant === "glass",
                        "border border-white/40 neo-flat text-gray-700 rounded-[2rem] active:neo-pressed hover:text-gray-900": variant === "outline",
                        "hover:bg-black/5 hover:text-gray-900 rounded-[2rem]": variant === "ghost",
                        "h-12 px-6 py-2": size === "default",
                        "h-10 rounded-[1.5rem] px-4 text-xs": size === "sm",
                        "h-14 rounded-[2.5rem] px-10 text-base": size === "lg",
                        "h-12 w-12 rounded-full": size === "icon",
                    },
                    className
                )}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
