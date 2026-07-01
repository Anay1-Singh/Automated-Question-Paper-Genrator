"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuthTheme } from "./ThemeTransition";

export default function PasswordField({
  label,
  id,
  value = "",
  onChange,
  required = false,
  ...props
}) {
  const { isDark } = useAuthTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isFilled = value.length > 0;

  const toggleVisibility = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative w-full mb-5 font-sans">
      <input
        type={showPassword ? "text" : "password"}
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full h-13 pl-4 pr-12 pt-5 pb-1 rounded-lg border text-sm transition-all duration-300 ease-out focus:outline-none ${
          isDark
            ? "bg-[#111111] border-[#262626] text-white focus:border-white focus:ring-1 focus:ring-white"
            : "bg-white border-[#E5E5E5] text-black focus:border-black focus:ring-1 focus:ring-black"
        }`}
        {...props}
      />
      <label
        htmlFor={id}
        className={`absolute left-4 top-4 text-sm transition-all duration-300 pointer-events-none origin-top-left ${
          isFocused || isFilled
            ? `transform -translate-y-2.5 scale-85 ${isDark ? "text-neutral-400" : "text-neutral-500"}`
            : isDark
            ? "text-neutral-500"
            : "text-neutral-400"
        }`}
      >
        {label}
      </label>
      
      <button
        type="button"
        onClick={toggleVisibility}
        className={`absolute right-4 top-4 p-0.5 rounded focus:outline-none transition-colors duration-200 ${
          isDark 
            ? "text-neutral-500 hover:text-white" 
            : "text-neutral-400 hover:text-black"
        }`}
      >
        {showPassword ? (
          <EyeOff className="w-4 h-4" />
        ) : (
          <Eye className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
