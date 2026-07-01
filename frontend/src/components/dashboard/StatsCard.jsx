"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/utils/cn";

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  trendDirection = "up",
  sparkPoints = [5, 15, 10, 25, 20, 32]
}) {
  const isUp = trendDirection === "up";

  // Calculate SVG line path based on numeric coordinates
  const svgPath = sparkPoints
    .map((val, idx) => {
      const x = (idx / (sparkPoints.length - 1)) * 90 + 5;
      const y = 30 - ((val - Math.min(...sparkPoints)) / (Math.max(...sparkPoints) - Math.min(...sparkPoints))) * 20 - 5;
      return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="p-4 rounded-xl bg-[#09090B] border border-zinc-800 flex flex-col justify-between h-[115px] hover:border-zinc-700 transition-colors"
    >
      {/* Top Title & Icon */}
      <div className="flex justify-between items-center select-none">
        <span className="text-zinc-550 text-[10px] font-bold uppercase tracking-wider">
          {title}
        </span>
        <div className="p-1.5 rounded bg-zinc-900 border border-zinc-850 text-zinc-500">
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Bottom Value, Trend, Sparkline */}
      <div className="flex items-end justify-between mt-2">
        <div className="flex flex-col">
          <span className="text-xl font-bold text-white tracking-tight font-sans">
            {value}
          </span>
          <div className="flex items-center gap-1.5 mt-0.5 select-none">
            {isUp ? (
              <TrendingUp className="w-3 h-3 text-emerald-500" />
            ) : (
              <TrendingDown className="w-3 h-3 text-red-500" />
            )}
            <span className={cn(
              "text-[9px] font-bold font-mono tracking-wide",
              isUp ? "text-emerald-500" : "text-red-500"
            )}>
              {trend}
            </span>
          </div>
        </div>

        {/* Custom SVG Sparkline Graph */}
        <div className="w-16 h-7 shrink-0 text-blue-500 select-none">
          <svg className="w-full h-full" viewBox="0 0 100 30" fill="none">
            {/* Background shadow stroke */}
            <path
              d={svgPath}
              stroke="#2563EB"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-70"
            />
            {/* Sparkline gradient fill (optional, let's keep it simple for minimal feel) */}
          </svg>
        </div>
      </div>
    </motion.div>
  );
}
