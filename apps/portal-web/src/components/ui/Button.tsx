"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface ButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragEnd" | "onDragStart"
  > {
  variant?: "primary" | "secondary" | "outline";
  children: ReactNode;
}

export function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "px-6 py-3 rounded-lg font-medium transition-all duration-200 font-semibold uppercase tracking-wider";
  const variants = {
    primary:
      "bg-[var(--genesis-flame-orange)] text-white hover:bg-[var(--genesis-flame-orange-hover)] shadow-[0_0_20px_rgba(255,61,0,0.3)] hover:shadow-[0_0_30px_rgba(255,61,0,0.5)] active:scale-95",
    secondary:
      "bg-[var(--genesis-glass)] text-[var(--genesis-text-primary)] border border-[var(--genesis-border-default)] hover:bg-[var(--genesis-glass-hover)] hover:border-[var(--genesis-flame-orange)] active:scale-95",
    outline:
      "border-2 border-[var(--genesis-cipher-cyan)] text-[var(--genesis-cipher-cyan)] hover:bg-[var(--genesis-cipher-cyan)]/10 hover:shadow-[0_0_20px_rgba(0,255,200,0.3)] active:scale-95",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...(props as any)}
    >
      {children as any}
    </motion.button>
  );
}

