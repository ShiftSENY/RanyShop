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
            // Primary — #B35E2B Warm Terracotta
            "bg-[#B35E2B] text-white hover:bg-[#984E22] active:bg-[#7A3D18] focus:ring-[#B35E2B]":
              variant === "primary",
            // Secondary — Crisp warm neutral border
            "bg-white text-[#2D3319] border border-[#E5DFD7] hover:bg-[#FAF7F2] active:bg-[#F4EFEB] focus:ring-[#B35E2B]":
              variant === "secondary",
            // Danger — Destructive
            "bg-red-700 text-white hover:bg-red-800 active:bg-red-900 focus:ring-red-600":
              variant === "danger",
            // Ghost — Transparent hover
            "bg-transparent text-[#2D3319] hover:bg-[#B35E2B]/10 hover:text-[#984E22] focus:ring-[#B35E2B] shadow-none":
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
