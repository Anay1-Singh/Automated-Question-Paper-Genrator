"use client";

import { Sparkles, FileText, Compass, Settings } from "lucide-react";
import Button from "@/components/common/Button";

export default function SuggestionCard() {
  return (
    <div className="p-5 rounded-xl bg-[#09090B] border border-zinc-800 flex flex-col justify-between h-full select-none">
      
      {/* Header title */}
      <div>
        <div className="flex items-center gap-2 border-b border-zinc-900 pb-3 mb-4">
          <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
          <span className="text-white font-bold text-xs">
            AI Suggestions
          </span>
        </div>

        {/* Suggestion Item 1 */}
        <div className="flex flex-col gap-3.5">
          <div className="flex items-start gap-3">
            <FileText className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-zinc-400 font-mono text-[9px] uppercase tracking-wider block">
                Recently Uploaded Source
              </span>
              <span className="text-zinc-200 text-xs font-semibold mt-0.5">
                Machine Learning.pdf
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="flex items-start gap-3">
            <Compass className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-zinc-400 font-mono text-[9px] uppercase tracking-wider block">
                Recommended Layout
              </span>
              <span className="text-zinc-200 text-xs font-semibold mt-0.5">
                Balanced (50% conceptual, 50% application)
              </span>
            </div>
          </div>

          {/* Suggested Bloom Breakdown */}
          <div className="flex items-start gap-3">
            <Settings className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
            <div className="flex flex-col w-full">
              <span className="text-zinc-400 font-mono text-[9px] uppercase tracking-wider block">
                Suggested Distribution
              </span>
              <div className="mt-2 flex flex-col gap-1.5 bg-black/40 p-2.5 rounded-lg border border-zinc-900 text-[10px]">
                <div className="flex justify-between items-center text-zinc-450">
                  <span>L1-L2 (Recall / Understand)</span>
                  <span className="font-mono font-semibold text-zinc-300">40%</span>
                </div>
                <div className="flex justify-between items-center text-zinc-450">
                  <span>L3-L4 (Apply / Analyze)</span>
                  <span className="font-mono font-semibold text-zinc-300">40%</span>
                </div>
                <div className="flex justify-between items-center text-zinc-450">
                  <span>L5-L6 (Evaluate / Create)</span>
                  <span className="font-mono font-semibold text-zinc-300">20%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-6 pt-4 border-t border-zinc-900">
        <Button variant="accent" className="w-full py-2.5 text-xs font-semibold">
          Generate Now
        </Button>
      </div>

    </div>
  );
}
