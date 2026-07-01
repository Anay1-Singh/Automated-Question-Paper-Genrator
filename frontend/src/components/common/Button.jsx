"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className,
  ...props
}) {
  const baseStyles = "relative inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-zinc-500 disabled:opacity-50 disabled:pointer-events-none text-xs tracking-wide px-5 py-2.5 overflow-hidden";
  
  const variants = {
    primary: "text-black bg-white hover:bg-zinc-200 active:bg-zinc-300 border border-transparent",
    secondary: "text-zinc-300 bg-zinc-900/60 hover:text-white border border-zinc-800 hover:bg-zinc-900 active:bg-zinc-950",
    outline: "text-white bg-transparent border border-zinc-850 hover:border-zinc-700 hover:bg-zinc-950 active:bg-zinc-900",
    accent: "text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 border border-transparent"
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={cn(baseStyles, variants[variant], className)}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-1.5">
        {children}
      </span>
    </motion.button>
  );
}
