"use client";

import { useState } from "react";
import { BookOpen, Sparkles, AlertCircle, HelpCircle, CheckCircle } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";

const COGNITIVE_LEVELS = [
  { id: "L1", name: "L1 - Remembering", desc: "Retrieve, recall, locate, define, or duplicate factual syllabus criteria.", verbs: "Define, List, Name, Recall, Label" },
  { id: "L2", name: "L2 - Understanding", desc: "Interpret, summarize, explain, classify, or construct conceptual meanings.", verbs: "Explain, Describe, Summarize, Compare" },
  { id: "L3", name: "L3 - Applying", desc: "Carry out, execute, calculate, or implement a procedure in new environments.", verbs: "Calculate, Solve, Use, Implement, Illustrate" },
  { id: "L4", name: "L4 - Analyzing", desc: "Deconstruct systems into components, determine structural relationships.", verbs: "Analyze, Contrast, Compare, Relate, Distinguish" },
  { id: "L5", name: "L5 - Evaluating", desc: "Critique, judge, appraise, defend decisions based on specific rubric criteria.", verbs: "Evaluate, Critique, Judge, Justify, Defend" },
  { id: "L6", name: "L6 - Creating", desc: "Formulate, design, construct, or devise original items or architectures.", verbs: "Design, Formulate, Construct, Devise, Invent" }
];

export default function BloomsGuidePage() {
  const [testText, setTestText] = useState("");
  const [analyzedLevel, setAnalyzedLevel] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClassify = (e) => {
    e.preventDefault();
    if (!testText.trim()) return;
    setLoading(true);
    setAnalyzedLevel(null);

    // Mock processing timeout
    setTimeout(() => {
      setLoading(false);
      const val = testText.toLowerCase();
      if (val.includes("design") || val.includes("create") || val.includes("construct")) {
        setAnalyzedLevel({ id: "L6", name: "L6 - Creating", score: "96% Confidence" });
      } else if (val.includes("evaluate") || val.includes("critique") || val.includes("justify")) {
        setAnalyzedLevel({ id: "L5", name: "L5 - Evaluating", score: "89% Confidence" });
      } else if (val.includes("compare") || val.includes("contrast") || val.includes("analyze")) {
        setAnalyzedLevel({ id: "L4", name: "L4 - Analyzing", score: "94% Confidence" });
      } else if (val.includes("calculate") || val.includes("solve") || val.includes("implement")) {
        setAnalyzedLevel({ id: "L3", name: "L3 - Applying", score: "91% Confidence" });
      } else if (val.includes("explain") || val.includes("describe") || val.includes("summarize")) {
        setAnalyzedLevel({ id: "L2", name: "L2 - Understanding", score: "95% Confidence" });
      } else {
        setAnalyzedLevel({ id: "L1", name: "L1 - Remembering", score: "88% Confidence" });
      }
    }, 800);
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1000px] mx-auto flex flex-col gap-8">
        
        {/* Page Header */}
        <div className="flex flex-col">
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Bloom's Taxonomy Framework
          </h1>
          <p className="text-zinc-550 text-xs md:text-sm font-light mt-1">
            Learn how the platform leverages the six cognitive learning domains to calibrate balance assessments.
          </p>
        </div>

        {/* Classifier Tester tool */}
        <Card hoverBorder={false} className="border-blue-600/30 bg-[#09090B] flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-zinc-900 pb-3">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="text-white font-bold text-sm select-none">
              AI Cognitive Level Classifier (Interactive Sandbox)
            </span>
          </div>

          <form onSubmit={handleClassify} className="flex flex-col gap-3.5">
            <label className="text-zinc-400 text-[10px] uppercase font-bold tracking-wider block">
              Enter draft question below to check its taxonomy level
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                placeholder="e.g. Design a visual layout representing the MVC design architecture..."
                className="flex-1 bg-black border border-zinc-800 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-zinc-700 placeholder-zinc-650"
              />
              <Button type="submit" variant="accent" className="px-5 py-2.5 text-xs font-semibold shrink-0">
                {loading ? "Analyzing..." : "Classify Question"}
              </Button>
            </div>
          </form>

          {/* Results panel */}
          {analyzedLevel && (
            <div className="mt-2 p-3 bg-zinc-950 border border-zinc-900 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-zinc-400">Classified level:</span>
                <span className="text-white font-bold">{analyzedLevel.name}</span>
              </div>
              <span className="text-[10px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-900 px-2 py-0.5 rounded">
                {analyzedLevel.score}
              </span>
            </div>
          )}
        </Card>

        {/* Cognitive Domains Grid (2 columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {COGNITIVE_LEVELS.map((lvl) => (
            <Card key={lvl.id} hoverBorder={true} className="flex flex-col justify-between h-[180px] p-5">
              <div>
                <div className="flex items-center gap-2.5 border-b border-zinc-900 pb-2.5 mb-3">
                  <BookOpen className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span className="text-white font-bold text-xs tracking-wide">
                    {lvl.name}
                  </span>
                </div>
                <p className="text-zinc-400 text-[11px] leading-relaxed font-light">
                  {lvl.desc}
                </p>
              </div>

              {/* Action verbs list footer */}
              <div className="mt-4 pt-2 border-t border-zinc-900 text-[10px]">
                <span className="text-zinc-550 font-mono text-[8px] uppercase tracking-wider block mb-1">Target Verbs</span>
                <span className="text-zinc-300 font-medium font-sans leading-none">{lvl.verbs}</span>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
}
