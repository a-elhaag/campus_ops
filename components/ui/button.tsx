import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "glass" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#9D4EDD] disabled:pointer-events-none disabled:opacity-50 active:scale-95",
          {
            "neo-vibrant text-white rounded-[2rem] hover:shadow-lg":
              variant === "default",
            "neo-flat text-gray-700 rounded-[2rem] active:neo-pressed active:shadow-none hover:text-gray-900 hover:shadow-md":
              variant === "glass",
            "border border-white/40 neo-flat text-gray-700 rounded-[2rem] active:neo-pressed hover:text-gray-900 hover:shadow-md":
              variant === "outline",
            "hover:bg-black/5 hover:text-gray-900 rounded-[2rem] transition-colors duration-200":
              variant === "ghost",
            "h-12 px-6 py-2": size === "default",
            "h-10 rounded-[1.5rem] px-4 text-xs": size === "sm",
            "h-14 rounded-[2.5rem] px-10 text-base": size === "lg",
            "h-12 w-12 rounded-full": size === "icon",
          },
          className,
        )}
        {...props}
      >
        {isLoading && (
          <span className="inline-flex mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent opacity-75" />
        )}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button };
