"use client";

import { PieChart, Info } from "lucide-react";

const SEGMENTS = [
  { label: "L1-L2 (Remember / Understand)", val: "40%", color: "bg-zinc-500", stroke: "#3F3F46", desc: "Foundational concepts", dash: "90.48", offset: "0" },
  { label: "L3-L4 (Apply / Analyze)", val: "40%", color: "bg-blue-600", stroke: "#2563EB", desc: "Active logical applications", dash: "90.48", offset: "-90.48" },
  { label: "L5-L6 (Evaluate / Create)", val: "20%", color: "bg-emerald-500", stroke: "#10B981", desc: "Design & evaluations", dash: "45.24", offset: "-180.96" }
];

export default function BloomChart() {
  return (
    <div className="p-5 rounded-xl bg-[#09090B] border border-zinc-800 flex flex-col h-full select-none">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-5">
        <div className="flex items-center gap-2">
          <PieChart className="w-4 h-4 text-blue-500 shrink-0" />
          <span className="text-white font-bold text-xs">Bloom Distribution</span>
        </div>
        <button title="Info" className="text-zinc-600 hover:text-zinc-300">
          <Info className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center flex-1">
        <div className="sm:col-span-5 flex justify-center relative">
          <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="36" fill="transparent" stroke="#18181B" strokeWidth="8" />
            {SEGMENTS.map((s, i) => (
              <circle key={i} cx="50" cy="50" r="36" fill="transparent" stroke={s.stroke} strokeWidth="8" strokeDasharray={`${s.dash} 226.2`} strokeDashoffset={s.offset} />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-base font-bold text-white font-mono">92%</span>
            <span className="text-[8px] text-zinc-500 font-semibold uppercase tracking-wider mt-0.5">Index</span>
          </div>
        </div>

        <div className="sm:col-span-7 flex flex-col gap-3">
          {SEGMENTS.map((item, idx) => (
            <div key={idx} className="flex gap-2.5 items-start">
              <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${item.color}`} />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-200 font-semibold text-[10px]">{item.label}</span>
                  <span className="text-white font-bold font-mono text-[10px]">{item.val}</span>
                </div>
                <span className="text-zinc-500 text-[8px] mt-0.5">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
