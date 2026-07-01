"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Brain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS } from "@/constants/content";
import Button from "@/components/common/Button";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-250 ${
          scrolled
            ? "py-3 bg-black border-b border-zinc-800"
            : "py-5 bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
          
          {/* Logo & Name */}
          <a href="#home" className="flex items-center gap-2.5">
            <Brain className="w-5 h-5 text-white shrink-0" />
            <span className="text-white font-bold text-sm tracking-tight">
              EduBloom AI
            </span>
          </a>

          {/* Center Nav Links */}
          <nav className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-zinc-400 hover:text-white transition-colors duration-150 text-[13px] font-medium"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-zinc-400 hover:text-white transition-colors duration-150 text-[13px] font-medium px-2 py-1"
            >
              Login
            </Link>
            <Link href="/signup">
              <Button variant="primary" className="py-2 px-4 rounded-md">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
            aria-label="Toggle navigation"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black pt-24 px-6 pb-8 flex flex-col justify-between md:hidden border-b border-zinc-800"
          >
            <nav className="flex flex-col gap-5">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium text-zinc-300 hover:text-white transition-colors py-1"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="flex flex-col gap-4 mt-8">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="text-center text-zinc-400 hover:text-white py-2 text-sm font-medium"
              >
                Login
              </Link>
              <Link href="/signup" onClick={() => setIsOpen(false)}>
                <Button
                  variant="primary"
                  className="w-full py-3 text-sm"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
