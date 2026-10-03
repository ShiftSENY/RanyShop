import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer shadow-2xs",
          {
            // Primary — #3AB7BA Botanical Turquoise
            "bg-[#3AB7BA] text-white hover:bg-[#2ea3a6] active:bg-[#258d90] focus:ring-[#3AB7BA]":
              variant === "primary",
            // Secondary — Crisp neutral border
            "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 active:bg-gray-100 focus:ring-[#3AB7BA]":
              variant === "secondary",
            // Danger — Destructive
            "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500":
              variant === "danger",
            // Ghost — Transparent hover
            "bg-transparent text-gray-700 hover:bg-[#3AB7BA]/10 hover:text-[#1a6f72] focus:ring-[#3AB7BA] shadow-none":
              variant === "ghost",
          },
          {
            "px-3 py-1.5 text-xs": size === "sm",
            "px-4 py-2 text-sm": size === "md",
            "px-6 py-2.5 text-base font-semibold": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export default Button;
