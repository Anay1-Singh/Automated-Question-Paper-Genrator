"use client";

import React from "react";
import { usePathname } from "next/navigation";
import ParticleBackground from "@/components/auth/ParticleBackground";
import ThemeTransition from "@/components/auth/ThemeTransition";

export default function AuthLayout({ children }) {
  const pathname = usePathname();
  // Set theme to dark for signup page, light for all other auth routes (like login)
  const theme = pathname === "/signup" ? "dark" : "light";

  return (
    <ThemeTransition theme={theme}>
      {/* Persisted Particle Network canvas */}
      <ParticleBackground />

      {/* Screen container for page content */}
      <main className="w-full min-h-screen flex items-center justify-center relative z-20 p-4 md:p-8">
        {children}
      </main>
    </ThemeTransition>
  );
}
