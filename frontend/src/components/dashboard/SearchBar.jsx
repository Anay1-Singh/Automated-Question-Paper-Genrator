"use client";

import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="relative w-full max-w-xs group select-none">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-zinc-300 transition-colors">
        <Search className="w-3.5 h-3.5" />
      </div>
      <input
        type="text"
        placeholder="Search console, documents, papers..."
        className="w-full pl-9 pr-12 py-1.5 bg-[#09090B] hover:bg-[#121214] focus:bg-[#09090B] border border-zinc-800 focus:border-zinc-700 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none transition-all duration-150"
      />
      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
        <span className="text-[9px] font-mono text-zinc-500 border border-zinc-800 bg-[#121214] px-1.5 py-0.5 rounded leading-none">
          ⌘K
        </span>
      </div>
    </div>
  );
}
