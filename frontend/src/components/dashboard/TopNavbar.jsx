"use client";

import { Bell, HelpCircle } from "lucide-react";
import SearchBar from "./SearchBar";
import Button from "@/components/common/Button";

export default function TopNavbar() {
  return (
    <header className="h-14 bg-black border-b border-zinc-850 px-6 flex items-center justify-between select-none z-20">
      
      {/* Left: Search Bar */}
      <SearchBar />

      {/* Right: Notifications, Help, Action Button */}
      <div className="flex items-center gap-4">
        
        {/* Help */}
        <button
          title="Help & Guides"
          className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-950/40 rounded transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <button
          title="Notifications"
          className="relative p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-950/40 rounded transition-colors"
        >
          <Bell className="w-4 h-4" />
          {/* Active notification indicator */}
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-500" />
        </button>

        {/* Divider */}
        <span className="text-zinc-800 text-[12px] font-mono">|</span>

        {/* Profile initials preview */}
        <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 text-[10px] font-bold cursor-pointer hover:bg-zinc-700 transition-colors">
          AN
        </div>

        {/* Action Button */}
        <Button variant="accent" className="py-1.5 px-3.5 rounded-md font-semibold text-[11px] h-8">
          Generate Paper
        </Button>

      </div>

    </header>
  );
}
