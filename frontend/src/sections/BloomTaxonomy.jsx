"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Check } from "lucide-react";

const TAXONOMY_DATA = [
  {
    id: "remember",
    level: "Level 1",
    name: "Remember",
    title: "Retrieve and Recall Information",
    description: "Evaluates basic memorization, definitions, lists, and factual recall from reference coursework.",
    verbs: ["Define", "List", "State", "Recall", "Name", "Identify"],
    example: "Q1. Define the first law of thermodynamics and list the standard units of energy."
  },
  {
    id: "understand",
    level: "Level 2",
    name: "Understand",
    title: "Interpret and Explain Concepts",
    description: "Evaluates the capacity to explain conceptual frameworks, summarize topics, and interpret meanings.",
    verbs: ["Describe", "Explain", "Summarize", "Compare", "Classify", "Discuss"],
    example: "Q2. Explain how negative feedback loops regulate blood glucose levels in humans."
  },
  {
    id: "apply",
    level: "Level 3",
    name: "Apply",
    title: "Execute and Implement Procedures",
    description: "Evaluates carrying out specific tasks or applying rules/procedures to solve problems in new situations.",
    verbs: ["Calculate", "Solve", "Implement", "Use", "Illustrate", "Demonstrate"],
    example: "Q3. Calculate the pH of a 0.05M solution of hydrochloric acid, showing all conversion steps."
  },
  {
    id: "analyze",
    level: "Level 4",
    name: "Analyze",
    title: "Deconstruct and Contrast Elements",
    description: "Evaluates breaking concepts into component parts to understand structural relationships and contrasts.",
    verbs: ["Compare", "Contrast", "Analyze", "Distinguish", "Deconstruct", "Relate"],
    example: "Q4. Compare and contrast the memory safety profiles of Rust and C++ during dynamic allocation."
  },
  {
    id: "evaluate",
    level: "Level 5",
    name: "Evaluate",
    title: "Appraise and Critique Decisions",
    description: "Evaluates defending a position or critiquing arguments based on specific standards, ethics, or criteria.",
    verbs: ["Evaluate", "Judge", "Critique", "Justify", "Appraise", "Support"],
    example: "Q5. Critique the layout of the current TCP congestion control protocol in high-latency environments."
  },
  {
    id: "create",
    level: "Level 6",
    name: "Create",
    title: "Formulate and Produce Original Works",
    description: "Evaluates putting elements together to form a novel structure or design a completely new framework.",
    verbs: ["Design", "Construct", "Formulate", "Devise", "Synthesize", "Invent"],
    example: "Q6. Design a microservice architecture scheme that guarantees eventual consistency across database nodes."
  }
];

export default function BloomTaxonomy() {
  const [activeLevel, setActiveLevel] = useState(TAXONOMY_DATA[0]);

  return (
    <section id="blooms-taxonomy" className="relative py-24 md:py-32 bg-black border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-20 text-left">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-3 select-none">
              Cognitive Dimensions
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
              Bloom's Taxonomy Framework
            </h3>
            <p className="mt-4 text-sm md:text-base text-zinc-400 font-light leading-relaxed max-w-2xl">
              Construct examinations covering the entire cognitive scale. Toggle between levels below to inspect target verbs and generated questions.
            </p>
          </motion.div>
        </div>

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Column: Stacked Horizontal Cards */}
          <div className="lg:col-span-5 flex flex-col gap-2">
            {TAXONOMY_DATA.map((item) => {
              const isActive = activeLevel.id === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveLevel(item)}
                  className={`w-full text-left p-4 rounded-lg border transition-all duration-150 flex items-center justify-between ${
                    isActive
                      ? "bg-zinc-900 border-zinc-700 text-white shadow-sm"
                      : "bg-[#09090B] border-zinc-850 text-zinc-400 hover:border-zinc-800 hover:text-zinc-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      isActive ? "bg-blue-600 text-white" : "bg-zinc-850 text-zinc-500"
                    }`}>
                      {item.level}
                    </span>
                    <span className="text-sm font-semibold tracking-wide">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-500 font-mono">
                    {item.verbs[0]}, {item.verbs[1]}...
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Column: Detailed Info Panel */}
          <div className="lg:col-span-7 flex">
            <div className="w-full rounded-xl bg-[#09090B] border border-zinc-800 p-8 flex flex-col justify-between relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeLevel.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col h-full justify-between"
                >
                  {/* Top: Description & Verbs */}
                  <div>
                    <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-6">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-blue-500" />
                        <span className="text-xs font-mono font-semibold text-zinc-400">
                          {activeLevel.level} Classification
                        </span>
                      </div>
                      <span className="text-white font-bold text-lg">
                        {activeLevel.name}
                      </span>
                    </div>

                    <h4 className="text-white font-bold text-base mb-2">
                      {activeLevel.title}
                    </h4>
                    <p className="text-zinc-400 text-xs leading-relaxed font-light mb-6">
                      {activeLevel.description}
                    </p>

                    {/* Action Verbs Checklist */}
                    <div className="mb-6">
                      <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider block mb-3">
                        Target Action Verbs
                      </span>
                      <div className="grid grid-cols-3 gap-3">
                        {activeLevel.verbs.map((verb) => (
                          <div key={verb} className="flex items-center gap-1.5 text-zinc-300 text-xs">
                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span className="font-light">{verb}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom: Sample Question Box */}
                  <div className="mt-auto bg-black border border-zinc-900 rounded-lg p-4">
                    <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider block mb-2">
                      Sample Generated Question
                    </span>
                    <p className="text-white text-xs font-mono leading-relaxed font-light">
                      {activeLevel.example}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
