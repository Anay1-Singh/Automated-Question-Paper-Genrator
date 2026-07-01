"use client";

import React, { createContext, useContext, useEffect } from "react";

// Create context for sharing the authentication theme (dark or light)
export const ThemeContext = createContext({
  theme: "dark", // default to dark (Signup page)
});

export const useAuthTheme = () => useContext(ThemeContext);

export default function ThemeTransition({ theme = "dark", children }) {
  // Sync the document body style or class if needed, or manage it via the wrapper div
  useEffect(() => {
    // In Next.js, updating the body className can be useful to align overall styles
    if (theme === "dark") {
      document.body.style.backgroundColor = "#000000";
      document.body.style.color = "#FFFFFF";
    } else {
      document.body.style.backgroundColor = "#FFFFFF";
      document.body.style.color = "#000000";
    }
    // Clean up or keep it smooth
    document.body.style.transition = "background-color 0.7s cubic-bezier(0.4, 0, 0.2, 1), color 0.7s cubic-bezier(0.4, 0, 0.2, 1)";
  }, [theme]);

  const value = {
    theme,
    isDark: theme === "dark",
  };

  return (
    <ThemeContext.Provider value={value}>
      <div
        className={`w-full min-h-screen flex flex-col items-center justify-center transition-colors duration-700 ease-out select-none relative z-10 ${
          theme === "dark" ? "bg-black text-white" : "bg-white text-black"
        }`}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
