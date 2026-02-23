import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeroButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  asChild?: boolean;
}

export function HeroButton({
  children,
  variant = "primary",
  size = "md",
  className,
  onClick,
  type = "button",
  disabled = false,
  asChild = false,
  ...props
}: HeroButtonProps) {
  const baseStyles = "font-semibold tracking-wide transition-all duration-200";

  const variants = {
    primary:
      "bg-lavender-gradient text-[#1a1a2e] hover:shadow-lavender hover:scale-105",
    secondary:
      "text-[#e6d9ff] border-[#3d3d5c] hover:bg-[#c8a2ff]/10 hover:border-[#c8a2ff]/40 backdrop-blur-sm glass-effect border",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="inline-block"
    >
      <Button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        onClick={onClick}
        type={type}
        disabled={disabled}
        asChild={asChild}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
}
