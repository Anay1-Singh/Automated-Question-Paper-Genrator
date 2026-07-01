"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAuthTheme } from "./ThemeTransition";

export default function AuthCard({ children }) {
  const { isDark } = useAuthTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.97 }}
      transition={{
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1], // Custom Apple/Linear style cubic bezier
      }}
      className={`w-full max-w-md p-8 md:p-10 rounded-2xl border transition-colors duration-700 relative z-20 ${
        isDark
          ? "bg-[#111111] border-[#262626] text-white"
          : "bg-white border-[#E5E5E5] text-black"
      }`}
      style={{
        boxShadow: isDark
          ? "0 4px 30px rgba(0, 0, 0, 0.4)"
          : "0 4px 30px rgba(0, 0, 0, 0.03)",
      }}
    >
      {children}
    </motion.div>
  );
}
