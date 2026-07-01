"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
import Logo from "@/components/auth/Logo";
import InputField from "@/components/auth/InputField";
import PasswordField from "@/components/auth/PasswordField";
import GoogleButton from "@/components/auth/GoogleButton";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login and redirect to dashboard
    router.push("/dashboard");
  };

  const handleGoogleLogin = () => {
    // Simulate Google OAuth and redirect
    router.push("/dashboard");
  };

  return (
    <AuthCard>
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <Logo className="w-11 h-11 mb-3" dark={false} />
        <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-neutral-400">
          EduBloom AI
        </span>
        <h2 className="text-[11px] text-neutral-500 mt-1 max-w-[260px] tracking-wide leading-relaxed">
          Automated Question Paper Generator
        </h2>
        <h1 className="text-xl font-semibold mt-4 tracking-tight text-black">
          Welcome back
        </h1>
        <p className="text-xs text-neutral-500 mt-1 max-w-[260px]">
          Log in to manage and generate intelligent papers.
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Email Address"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <PasswordField
          label="Password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Remember Me and Forgot Password row */}
        <div className="flex items-center justify-between py-1">
          <label className="flex items-center gap-3 cursor-pointer text-xs select-none">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-[17px] h-[17px] rounded border flex items-center justify-center transition-all duration-300 ease-out ${
                  rememberMe
                    ? "bg-black border-black text-white"
                    : "bg-transparent border-[#E5E5E5] hover:border-neutral-400"
                }`}
              >
                {rememberMe && (
                  <svg
                    className="w-2.5 h-2.5 stroke-[2.5]"
                    viewBox="0 0 10 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 5L4.5 7.5L8.5 2.5"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-neutral-500">Remember me</span>
          </label>

          <a href="#" className="text-xs text-neutral-500 hover:text-black transition-colors">
            Forgot password?
          </a>
        </div>

        {/* Primary Action Button */}
        <button
          type="submit"
          className="w-full h-11 bg-black text-white rounded-lg text-sm font-semibold hover:bg-neutral-800 active:scale-[0.99] transition-all duration-300 cursor-pointer shadow-sm mt-2"
        >
          Log In
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center my-6">
        <div className="flex-1 border-t border-[#E5E5E5]" />
        <span className="px-3 text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">
          OR
        </span>
        <div className="flex-1 border-t border-[#E5E5E5]" />
      </div>

      {/* Social Google OAuth Button */}
      <GoogleButton onClick={handleGoogleLogin} label="Continue with Google" />

      {/* Footer Text */}
      <div className="text-center mt-8 text-xs text-neutral-500">
        Don't have an account?{" "}
        <Link
          href="/signup"
          className="text-black font-medium hover:underline transition-all"
        >
          Sign Up
        </Link>
      </div>
    </AuthCard>
  );
}
