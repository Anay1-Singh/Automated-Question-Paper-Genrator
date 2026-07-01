"use client";

import Link from "next/link";
import { UploadCloud, PlusCircle, Database, BookOpen, BarChart2 } from "lucide-react";

const ACTIONS = [
  { label: "Upload Document", icon: UploadCloud, href: "/dashboard/documents" },
  { label: "Generate Paper", icon: PlusCircle, href: "/dashboard/generate-paper" },
  { label: "Question Bank", icon: Database, href: "/dashboard/bank" },
  { label: "Bloom Taxonomy", icon: BookOpen, href: "/dashboard/blooms" },
  { label: "Analytics", icon: BarChart2, href: "/dashboard/analytics" }
];

export default function QuickActions() {
  return (
    <div className="p-5 rounded-xl bg-[#09090B] border border-zinc-800 flex flex-col select-none">
      <span className="text-white font-bold text-xs border-b border-zinc-900 pb-3 mb-4">
        Quick Actions
      </span>

      <div className="flex flex-col gap-2">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.label} href={action.href} className="w-full">
              <button
                type="button"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[11px] font-semibold text-zinc-400 hover:text-white bg-transparent hover:bg-zinc-900/40 border border-transparent hover:border-zinc-800 transition-all duration-150 text-left cursor-pointer"
              >
                <Icon className="w-4 h-4 shrink-0 text-blue-500" />
                {action.label}
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
