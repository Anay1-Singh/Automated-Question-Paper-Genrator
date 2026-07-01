"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  PlusCircle, 
  Files, 
  FileText, 
  BarChart2, 
  BookOpen, 
  Database, 
  User, 
  Settings, 
  LogOut, 
  BrainCircuit 
} from "lucide-react";
import { cn } from "@/utils/cn";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Generate Paper", icon: PlusCircle, href: "/dashboard/generate-paper" },
  { label: "Documents", icon: Files, href: "/dashboard/documents" },
  { label: "Question Papers", icon: FileText, href: "/dashboard/question-papers" },
  { label: "Analytics", icon: BarChart2, href: "/dashboard/analytics" },
  { label: "Bloom's Taxonomy", icon: BookOpen, href: "/dashboard/blooms" },
  { label: "Question Bank", icon: Database, href: "/dashboard/bank" },
  { label: "Profile", icon: User, href: "/dashboard/profile" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 h-screen bg-black border-r border-zinc-850 flex flex-col justify-between p-5 select-none z-30">
      
      {/* Top: Logo Header */}
      <div className="flex flex-col gap-6">
        <Link href="/" className="flex items-center gap-2.5 px-2">
          <BrainCircuit className="w-5 h-5 text-blue-500" />
          <div className="flex flex-col">
            <span className="text-white font-bold text-sm tracking-wide leading-none">
              QGen AI
            </span>
            <span className="text-[9px] text-zinc-500 tracking-wider uppercase font-semibold mt-1">
              Bloom's Taxonomy
            </span>
          </div>
        </Link>

        {/* Center: Links */}
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            // Match active path exactly, or check if it starts with the href (for sub-routes)
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors duration-150 text-left w-full",
                  isActive
                    ? "bg-zinc-900/60 text-white"
                    : "bg-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/20"
                )}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-blue-500 rounded-full" />
                )}
                
                <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-blue-500" : "text-zinc-500")} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Upgrade & User Info */}
      <div className="flex flex-col gap-4">
        
        {/* Upgrade Plan Card */}
        <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-900 text-[11px]">
          <div className="flex justify-between items-center mb-1">
            <span className="text-white font-bold">Standard Account</span>
            <span className="text-blue-500 font-bold uppercase tracking-wider text-[8px] bg-blue-950 border border-blue-900 px-1.5 py-0.5 rounded">
              PRO
            </span>
          </div>
          <p className="text-zinc-500 text-[10px] leading-relaxed">
            Generate up to 50 question papers per semester. 18 / 50 used.
          </p>
          <button className="w-full mt-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-[10px] font-semibold border border-zinc-800 hover:border-zinc-700 transition-colors">
            Upgrade Plan
          </button>
        </div>

        {/* User Card */}
        <div className="flex items-center justify-between border-t border-zinc-900 pt-4 px-1">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              AN
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-zinc-200 text-[11px] font-semibold truncate leading-none mb-0.5">
                Anay Patel
              </span>
              <span className="text-zinc-500 text-[9px] truncate">
                anay@university.edu
              </span>
            </div>
          </div>
          <Link href="/login">
            <button
              title="Log Out"
              className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40 rounded transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>

      </div>

    </aside>
  );
}
