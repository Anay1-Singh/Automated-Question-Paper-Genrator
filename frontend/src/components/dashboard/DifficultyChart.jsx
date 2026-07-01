"use client";

import { Sliders } from "lucide-react";

const LEVELS = [
  { label: "Easy", pct: 30, color: "bg-emerald-500" },
  { label: "Medium", pct: 50, color: "bg-blue-500" },
  { label: "Hard", pct: 20, color: "bg-rose-500" }
];

export default function DifficultyChart() {
  return (
    <div className="p-5 rounded-xl bg-[#09090B] border border-zinc-800 flex flex-col h-full select-none">
      <div className="flex items-center gap-2 border-b border-zinc-900 pb-3 mb-5">
        <Sliders className="w-4 h-4 text-blue-500 shrink-0" />
        <span className="text-white font-bold text-xs">Difficulty Distribution</span>
      </div>

      <div className="flex flex-col gap-5 flex-1 justify-center">
        {LEVELS.map((lvl) => (
          <div key={lvl.label} className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <span className="text-zinc-300 text-[11px] font-medium">{lvl.label}</span>
              <span className="text-zinc-400 text-[10px] font-mono font-bold">{lvl.pct}%</span>
            </div>
            <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${lvl.color}`}
                style={{ width: `${lvl.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
