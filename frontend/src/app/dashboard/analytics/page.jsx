"use client";

import { BarChart3, TrendingUp, Download, Eye, Award, Settings, BookOpen } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import BloomChart from "@/components/dashboard/BloomChart";
import DifficultyChart from "@/components/dashboard/DifficultyChart";

const METRICS = [
  { label: "Syllabus Coverage Score", val: "98%", desc: "Direct curriculum mapping", state: "Perfect" },
  { label: "Average Cognitive Index", val: "92 / 100", desc: "Bloom's taxonomy balance", state: "Healthy" },
  { label: "Drafting Speed (avg)", val: "1.5 mins", desc: "Generative time efficiency", state: "Optimal" },
  { label: "Originality Index", val: "99.4%", desc: "Plagiarism-free check", state: "Passed" }
];

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-[1280px] mx-auto flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Platform Analytics
            </h1>
            <p className="text-zinc-550 text-xs md:text-sm font-light mt-1">
              Visualize educational quality scores, curriculum mappings, and taxonomy alignment indices.
            </p>
          </div>
          
          <Button variant="secondary" className="py-2 px-4 gap-1.5 font-bold shrink-0 w-full sm:w-auto">
            <Download className="w-4 h-4" /> Export Report CSV
          </Button>
        </div>

        {/* Core Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {METRICS.map((m) => (
            <Card key={m.label} hoverBorder={false} className="p-4 flex flex-col justify-between h-[110px]">
              <span className="text-zinc-550 text-[9px] font-bold uppercase tracking-wider block">
                {m.label}
              </span>
              <div className="flex items-end justify-between mt-2">
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-white font-mono">{m.val}</span>
                  <span className="text-zinc-500 text-[9px] mt-0.5 font-light">{m.desc}</span>
                </div>
                <span className="text-[9px] font-mono font-bold bg-zinc-950 border border-zinc-900 px-2 py-0.5 rounded text-emerald-400">
                  {m.state}
                </span>
              </div>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BloomChart />
          <DifficultyChart />
        </div>

        {/* Weak Topics Analysis Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Syllabus Coverage Details (Col 8) */}
          <div className="lg:col-span-8">
            <div className="flex flex-col border border-zinc-800 bg-[#09090B] rounded-xl overflow-hidden">
              <div className="bg-zinc-950/40 px-4 py-3 border-b border-zinc-800 flex justify-between items-center select-none">
                <span className="text-white font-bold text-xs">Course Alignment Details</span>
                <span className="text-zinc-500 text-[9px]">Syllabus matching breakdown</span>
              </div>
              
              <div className="flex flex-col divide-y divide-zinc-900 text-[11px] font-sans">
                {[
                  { course: "CS-101 Data Structures", chapters: "5 Chapters mapped", questions: "14 items", compliance: "98% Aligned" },
                  { course: "CS-204 Operating Systems", chapters: "8 Chapters mapped", questions: "22 items", compliance: "95% Aligned" },
                  { course: "MATH-150 Linear Algebra", chapters: "4 Chapters mapped", questions: "10 items", compliance: "92% Aligned" },
                  { course: "EE-110 Circuit Analysis", chapters: "6 Chapters mapped", questions: "15 items", compliance: "90% Aligned" }
                ].map((row, i) => (
                  <div key={i} className="px-4 py-3 flex items-center justify-between hover:bg-zinc-950/40 transition-colors">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-zinc-200 font-semibold">{row.course}</span>
                      <span className="text-zinc-550 text-[9px] font-light">{row.chapters} • {row.questions} generated</span>
                    </div>
                    <span className="text-emerald-450 font-bold font-mono text-[10px] bg-emerald-950/20 border border-emerald-900/30 px-2 py-0.5 rounded">
                      {row.compliance}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick recommendations box (Col 4) */}
          <div className="lg:col-span-4">
            <Card hoverBorder={false} className="flex flex-col gap-4 h-full">
              <span className="text-white font-bold text-xs uppercase tracking-wider border-b border-zinc-900 pb-3 block select-none">
                Platform Action Items
              </span>
              
              <div className="flex flex-col gap-4 text-xs font-light leading-relaxed text-zinc-400">
                <div className="flex gap-3">
                  <Award className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-zinc-200 font-semibold text-[11px]">Boost L5-L6 Evaluation items</span>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Calculations show only 15% descriptive weights in CS-101. Add higher levels for balanced midterms.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <BookOpen className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-zinc-200 font-semibold text-[11px]">Upload Database notes</span>
                    <p className="text-[10px] text-zinc-500 mt-0.5">No syllabus uploaded for course DBMS IT-220. Upload file to construct question pools.</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
