"use client";

import React, { useState } from "react";
import { useAuthTheme } from "./ThemeTransition";

export default function InputField({
  label,
  id,
  type = "text",
  value = "",
  onChange,
  required = false,
  ...props
}) {
  const { isDark } = useAuthTheme();
  const [isFocused, setIsFocused] = useState(false);
  const isFilled = value.length > 0;

  return (
    <div className="relative w-full mb-5 font-sans">
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full h-13 px-4 pt-5 pb-1 rounded-lg border text-sm transition-all duration-300 ease-out focus:outline-none ${
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
    </div>
  );
}
