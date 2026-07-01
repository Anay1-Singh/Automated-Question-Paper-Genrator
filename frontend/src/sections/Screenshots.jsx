"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout, Sliders, BarChart3, FileText, Download, Edit, Plus, Trash2, Eye } from "lucide-react";

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: Layout },
  { id: "generator", label: "Question Generator", icon: Sliders },
  { id: "analytics", label: "Analytics Panel", icon: BarChart3 },
  { id: "preview", label: "Print Preview", icon: FileText }
];

export default function Screenshots() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <section className="relative py-24 md:py-32 bg-black border-t border-zinc-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 text-left">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-3 select-none">
              Console Walkthrough
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
              A comprehensive interface for exam administration.
            </h3>
            <p className="mt-4 text-sm md:text-base text-zinc-400 font-light leading-relaxed max-w-2xl">
              Inspect the high-fidelity mockups of our core modules below, detailing real application pages.
            </p>
          </motion.div>
        </div>

        {/* Tab Selectors */}
        <div className="flex flex-wrap gap-2 border-b border-zinc-900 pb-4 mb-10">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-150 border ${
                  isActive
                    ? "bg-zinc-900 border-zinc-700 text-white"
                    : "bg-transparent border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Console Window */}
        <div className="w-full rounded-xl bg-[#09090B] border border-zinc-800 shadow-2xl overflow-hidden text-[11px] font-sans">
          
          {/* Mock Console Header */}
          <div className="bg-[#121214] border-b border-zinc-800 px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex gap-1.5 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
              </div>
              <span className="text-zinc-650 font-mono text-[9px] select-none">|</span>
              <span className="text-zinc-400 font-medium tracking-wide">
                Console / {TABS.find(t => t.id === activeTab).label}
              </span>
            </div>
            <div className="text-[10px] text-zinc-500 font-mono bg-black/40 px-6 py-0.5 rounded border border-zinc-800/40 select-none">
              console.edubloom.ai
            </div>
          </div>

          {/* Render Active View */}
          <div className="p-6 md:p-8 min-h-[380px] bg-black/30 flex flex-col justify-start">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="w-full flex-1 flex flex-col"
              >
                {/* 1. DASHBOARD VIEW */}
                {activeTab === "dashboard" && (
                  <div className="flex flex-col gap-6 w-full">
                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { label: "Active Courses", val: "4 Courses", desc: "CS-101, CS-204, EE-110, MATH-150" },
                        { label: "Total Question Banks", val: "1,248 Items", desc: "Sourced from 18 lectures" },
                        { label: "Mean Cognitive Index", val: "92 / 100", desc: "High taxonomic compliance rating" }
                      ].map(s => (
                        <div key={s.label} className="p-4 rounded-lg bg-zinc-950 border border-zinc-900">
                          <span className="text-zinc-500 text-[8px] uppercase tracking-wider font-semibold">{s.label}</span>
                          <p className="text-base font-bold text-white mt-1">{s.val}</p>
                          <span className="text-zinc-500 text-[9px] mt-0.5 block font-light">{s.desc}</span>
                        </div>
                      ))}
                    </div>

                    {/* Recent Papers Table */}
                    <div className="flex flex-col border border-zinc-900 rounded-lg overflow-hidden">
                      <div className="bg-zinc-950 px-4 py-2 border-b border-zinc-900 flex justify-between items-center">
                        <span className="text-zinc-400 font-semibold text-[10px]">RECENT ASSESSMENT PAPERS</span>
                        <button className="text-blue-500 hover:underline text-[9px] font-semibold">View All</button>
                      </div>
                      <div className="flex flex-col divide-y divide-zinc-900">
                        {[
                          { name: "MATH-150 Linear Algebra Final", date: "Jul 12, 2026", items: "30 Qs", compliance: "96% Perfect", status: "Approved" },
                          { name: "CS-101 Midterm Examination", date: "Jul 01, 2026", items: "15 Qs", compliance: "94% Balanced", status: "Draft" },
                          { name: "EE-110 Circuit Analysis Quiz 3", date: "Jun 24, 2026", items: "10 Qs", compliance: "90% Good", status: "Approved" }
                        ].map((row, i) => (
                          <div key={i} className="px-4 py-3 flex flex-wrap items-center justify-between hover:bg-zinc-950/40 transition-colors">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-zinc-200 font-semibold">{row.name}</span>
                              <span className="text-zinc-550 text-[9px] font-light">Drafted on {row.date} • {row.items}</span>
                            </div>
                            <div className="flex items-center gap-6 mt-2 sm:mt-0">
                              <span className="text-[10px] text-zinc-400 font-mono bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded">
                                {row.compliance}
                              </span>
                              <div className="flex items-center gap-3">
                                <button className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors">
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors">
                                  <Download className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. GENERATOR VIEW */}
                {activeTab === "generator" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
                    {/* Left: Input specs */}
                    <div className="lg:col-span-4 flex flex-col gap-4 border-r border-zinc-900 pr-0 lg:pr-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-zinc-500 font-bold text-[9px] uppercase tracking-wider">Course Identifier</span>
                        <input
                          type="text"
                          defaultValue="CS-101 Data Structures"
                          className="bg-zinc-950 border border-zinc-800 rounded p-2 text-white font-medium focus:outline-none focus:border-zinc-700"
                        />
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <span className="text-zinc-500 font-bold text-[9px] uppercase tracking-wider">Format Distribution</span>
                        <div className="flex gap-2">
                          <div className="flex-1 bg-zinc-950 border border-zinc-900 p-2 rounded text-center">
                            <span className="text-zinc-500 text-[8px] block">MCQs</span>
                            <span className="text-zinc-200 font-bold font-mono">10</span>
                          </div>
                          <div className="flex-1 bg-zinc-950 border border-zinc-900 p-2 rounded text-center">
                            <span className="text-zinc-500 text-[8px] block">Short Qs</span>
                            <span className="text-zinc-200 font-bold font-mono">5</span>
                          </div>
                          <div className="flex-1 bg-zinc-950 border border-zinc-900 p-2 rounded text-center">
                            <span className="text-zinc-500 text-[8px] block">Descriptive</span>
                            <span className="text-zinc-200 font-bold font-mono">2</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="text-zinc-500 font-bold text-[9px] uppercase tracking-wider">Target Level Profile</span>
                        <div className="bg-zinc-950 border border-zinc-900 p-3 rounded-lg flex flex-col gap-2">
                          <div className="flex justify-between items-center text-[9px] text-zinc-400">
                            <span>Applying (L3)</span>
                            <span>40%</span>
                          </div>
                          <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="bg-blue-600 h-full w-[40%]" />
                          </div>

                          <div className="flex justify-between items-center text-[9px] text-zinc-400">
                            <span>Analyzing (L4)</span>
                            <span>40%</span>
                          </div>
                          <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="bg-zinc-650 h-full w-[40%]" />
                          </div>
                        </div>
                      </div>

                      <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold text-[10px] transition-colors mt-2">
                        Regenerate Question Bank
                      </button>
                    </div>

                    {/* Right: Question list */}
                    <div className="lg:col-span-8 flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-500 font-bold text-[9px] uppercase tracking-wider">DRAFTED CONSOLE BANK (3 ITEMS)</span>
                        <button className="flex items-center gap-1 text-blue-500 hover:underline font-semibold text-[10px]">
                          <Plus className="w-3 h-3" /> Add Item
                        </button>
                      </div>

                      <div className="flex flex-col gap-2.5">
                        {[
                          { level: "L3", text: "Implement a function in JavaScript to detect cycles in a directed graph using depth-first search (DFS).", marks: "5 Marks" },
                          { level: "L4", text: "Analyze the time and space complexity of merge sort compared to quicksort in worst-case scenarios.", marks: "8 Marks" },
                          { level: "L2", text: "Describe the differences between an array-based stack implementation and a linked-list implementation.", marks: "4 Marks" }
                        ].map((q, idx) => (
                          <div key={idx} className="p-3 bg-zinc-950 border border-zinc-900 rounded-lg flex items-start justify-between gap-4 hover:border-zinc-800 transition-colors">
                            <div className="flex gap-3 items-start">
                              <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-850 text-zinc-400 font-mono font-bold text-[8px] shrink-0 mt-0.5">
                                {q.level}
                              </span>
                              <p className="text-zinc-300 leading-relaxed font-light">{q.text}</p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <span className="text-zinc-550 font-mono font-medium text-[9px]">{q.marks}</span>
                              <button className="p-0.5 text-zinc-600 hover:text-white transition-colors">
                                <Edit className="w-3 h-3" />
                              </button>
                              <button className="p-0.5 text-zinc-600 hover:text-zinc-400 transition-colors">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. ANALYTICS VIEW */}
                {activeTab === "analytics" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                    {/* Left: Bar Chart */}
                    <div className="flex flex-col gap-4">
                      <span className="text-zinc-500 font-bold text-[9px] uppercase tracking-wider">COGNITIVE LEVEL DISTRIBUTION</span>
                      <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-lg flex flex-col gap-4 h-[240px] justify-between">
                        
                        {/* Bars rendering */}
                        <div className="flex items-end justify-between h-[150px] px-2">
                          {[
                            { name: "Rem", val: 15, h: "h-[15%]" },
                            { name: "Und", val: 25, h: "h-[25%]" },
                            { name: "App", val: 30, h: "h-[30%]" },
                            { name: "Ana", val: 15, h: "h-[15%]" },
                            { name: "Eva", val: 10, h: "h-[10%]" },
                            { name: "Cre", val: 5, h: "h-[5%]" }
                          ].map((bar, i) => (
                            <div key={i} className="flex flex-col items-center gap-1.5 w-8">
                              <span className="text-[8px] font-mono text-zinc-500 font-semibold">{bar.val}%</span>
                              <div className={`w-full ${bar.h} bg-blue-600 rounded-t-sm`} />
                              <span className="text-[8px] text-zinc-400 mt-1 font-mono uppercase">{bar.name}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="border-t border-zinc-900 pt-3 text-[9px] text-zinc-500 leading-normal flex items-center justify-between">
                          <span>Target: Balanced Assessment</span>
                          <span className="text-zinc-400 font-bold font-mono">92% Compliance</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Quality Checks */}
                    <div className="flex flex-col gap-4">
                      <span className="text-zinc-500 font-bold text-[9px] uppercase tracking-wider">COGNITIVE COMPLIANCE METRICS</span>
                      <div className="flex flex-col border border-zinc-900 rounded-lg divide-y divide-zinc-900 overflow-hidden">
                        {[
                          { metric: "Syllabus Coverage Score", score: "98/100", grade: "Excellent", status: "Pass" },
                          { metric: "Bloom Balance Alignment", score: "94/100", grade: "Target Met", status: "Pass" },
                          { metric: "Difficulty Index (Mean)", score: "Medium", grade: "42% Ratio", status: "Aligned" },
                          { metric: "Answer Key Consistency", score: "100%", grade: "Calibrated", status: "Pass" },
                          { metric: "Originality Rating (Uniqueness)", score: "99.4%", grade: "Original", status: "Pass" }
                        ].map((row, idx) => (
                          <div key={idx} className="px-4 py-3 flex justify-between items-center hover:bg-zinc-950/40 transition-colors">
                            <span className="text-zinc-300 font-medium">{row.metric}</span>
                            <div className="flex items-center gap-6">
                              <span className="text-zinc-500 text-[9px]">{row.grade}</span>
                              <span className="text-white font-mono font-bold">{row.score}</span>
                              <span className="text-[9px] font-mono bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded font-semibold text-emerald-400">
                                {row.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. PRINT PREVIEW VIEW */}
                {activeTab === "preview" && (
                  <div className="flex flex-col gap-6 items-center w-full">
                    {/* A4 Paper mockup */}
                    <div className="w-full max-w-[500px] bg-white border border-zinc-300 shadow-md p-8 text-black font-serif select-none select-none text-[9px]">
                      
                      {/* School Header */}
                      <div className="text-center flex flex-col gap-1 border-b border-black pb-4 mb-5">
                        <span className="font-bold text-[10px] tracking-wide uppercase">DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING</span>
                        <span className="font-bold text-[11px] tracking-wider uppercase">STATE UNIVERSITY OF ENGINEERING</span>
                        <div className="flex justify-between items-center text-[8px] font-sans font-medium text-zinc-700 mt-2">
                          <span>COURSE: CS-101 DATA STRUCTURES</span>
                          <span>SEMESTER: FALL 2026</span>
                        </div>
                        <div className="flex justify-between items-center text-[8px] font-sans font-medium text-zinc-700">
                          <span>DURATION: 3 HOURS</span>
                          <span>MAX MARKS: 100</span>
                        </div>
                      </div>

                      {/* Instructions */}
                      <div className="mb-4 text-[8px] leading-relaxed">
                        <span className="font-bold font-sans">INSTRUCTIONS:</span> Answer all questions from Section A and Section B. Support your conceptual answers with neat flowchart drawings where appropriate.
                      </div>

                      {/* Section A */}
                      <div className="mb-4">
                        <span className="font-bold block border-b border-zinc-200 pb-1 mb-2 font-sans text-[8px]">SECTION A (Short Answer Questions • 30 Marks)</span>
                        <div className="flex flex-col gap-3">
                          <div className="flex justify-between items-start">
                            <span className="w-full">Q1. Draw the memory grid representation of a two-dimensional row-major array.</span>
                            <span className="font-bold shrink-0 ml-4 font-sans text-[8px]">(5)</span>
                          </div>
                          <div className="flex justify-between items-start">
                            <span className="w-full">Q2. Distinguish between quicksort and mergesort algorithms in worst-case time complexity.</span>
                            <span className="font-bold shrink-0 ml-4 font-sans text-[8px]">(5)</span>
                          </div>
                          <div className="flex justify-between items-start">
                            <span className="w-full">Q3. Evaluate how a circular queue prevents cell memory leaks compared to a linear queue.</span>
                            <span className="font-bold shrink-0 ml-4 font-sans text-[8px]">(10)</span>
                          </div>
                        </div>
                      </div>

                      {/* Section B */}
                      <div>
                        <span className="font-bold block border-b border-zinc-200 pb-1 mb-2 font-sans text-[8px]">SECTION B (Descriptive Questions • 70 Marks)</span>
                        <div className="flex flex-col gap-3">
                          <div className="flex justify-between items-start">
                            <span className="w-full">Q4. Design a binary search tree balancing schema using AVL rotations. Construct a visual step-by-step example showing node insertions for keys [12, 8, 4, 30, 24].</span>
                            <span className="font-bold shrink-0 ml-4 font-sans text-[8px]">(20)</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
