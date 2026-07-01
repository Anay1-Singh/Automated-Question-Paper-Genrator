"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
import Logo from "@/components/auth/Logo";
import InputField from "@/components/auth/InputField";
import PasswordField from "@/components/auth/PasswordField";
import GoogleButton from "@/components/auth/GoogleButton";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [university, setUniversity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate signup and redirect to dashboard
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
        <Logo className="w-11 h-11 mb-3" dark={true} />
        <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-neutral-500">
          EduBloom AI
        </span>
        <h2 className="text-[11px] text-neutral-400 mt-1 max-w-[260px] tracking-wide leading-relaxed">
          Automated Question Paper Generator
        </h2>
        <h1 className="text-xl font-semibold mt-4 tracking-tight text-white">
          Create your account
        </h1>
        <p className="text-xs text-neutral-400 mt-1 max-w-[260px]">
          Start generating intelligent question papers with AI.
        </p>
      </div>

      {/* Signup Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Full Name"
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <InputField
          label="University"
          id="university"
          type="text"
          value={university}
          onChange={(e) => setUniversity(e.target.value)}
          required
        />

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

        <PasswordField
          label="Confirm Password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {/* Checkbox Terms */}
        <div className="flex items-start py-1">
          <label className="flex items-center gap-3 cursor-pointer text-xs select-none">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="sr-only"
                required
              />
              <div
                className={`w-[17px] h-[17px] rounded border flex items-center justify-center transition-all duration-300 ease-out ${
                  agreeTerms
                    ? "bg-white border-white text-black"
                    : "bg-transparent border-[#262626] hover:border-neutral-700"
                }`}
              >
                {agreeTerms && (
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
            <span className="text-neutral-400 leading-normal">
              I accept the{" "}
              <span className="text-white hover:underline cursor-pointer transition-all">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-white hover:underline cursor-pointer transition-all">
                Privacy Policy
              </span>
            </span>
          </label>
        </div>

        {/* Primary Action Button */}
        <button
          type="submit"
          className="w-full h-11 bg-white text-black rounded-lg text-sm font-semibold hover:bg-neutral-200 active:scale-[0.99] transition-all duration-300 cursor-pointer shadow-sm mt-2"
        >
          Create Account
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center my-6">
        <div className="flex-1 border-t border-[#262626]" />
        <span className="px-3 text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">
          OR
        </span>
        <div className="flex-1 border-t border-[#262626]" />
      </div>

      {/* Social Google OAuth Button */}
      <GoogleButton onClick={handleGoogleLogin} label="Continue with Google" />

      {/* Footer Text */}
      <div className="text-center mt-8 text-xs text-neutral-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-white font-medium hover:underline transition-all"
        >
          Log In
        </Link>
      </div>
    </AuthCard>
  );
}
