"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, UploadCloud, FileText, Check, Cpu, Shield, Zap, GraduationCap } from "lucide-react";
import Button from "@/components/common/Button";

const MOCK_QUESTIONS = [
  {
    tag: "L3 - Applying",
    marks: "5 Marks",
    text: "Given a dataset of student test scores, write a Python function using Pandas to clean missing values and calculate the standard deviation."
  },
  {
    tag: "L4 - Analyzing",
    marks: "10 Marks",
    text: "Compare the performance trade-offs between SQL database indexing schemas and NoSQL document storage models under high write loads."
  }
];

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen pt-32 pb-20 flex items-center justify-center bg-black overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Side: Copywriting */}
        <div className="lg:col-span-6 flex flex-col justify-center text-left">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 w-fit mb-6"
          >
            <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-[10px] font-semibold text-zinc-300 uppercase tracking-widest">
              AI Powered Educational Platform
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-sans tracking-tight"
          >
            Automated Question Paper Generation <br className="hidden md:block"/>
            <span className="text-zinc-500 font-medium">Using Bloom's Taxonomy</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-6 text-sm md:text-base text-zinc-400 leading-relaxed max-w-xl font-light"
          >
            Generate intelligent, balanced, and curriculum-aligned question papers in minutes. Leverage NLP models to categorize items across cognitive dimensions automatically.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mt-8 flex flex-wrap gap-3 items-center"
          >
            <Link href="/signup">
              <Button variant="primary" className="py-2.5 px-5 gap-1.5 font-semibold">
                Get Started <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
            <Button variant="secondary" className="py-2.5 px-5 gap-1.5 font-medium">
              <Play className="w-3 h-3 fill-current" /> View Demo
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 pt-8 border-t border-zinc-900 grid grid-cols-2 gap-4 max-w-lg"
          >
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-zinc-500" />
              <span className="text-zinc-400 text-xs font-normal">Built for Universities</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-zinc-500" />
              <span className="text-zinc-400 text-xs font-normal">AI Powered Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-zinc-500" />
              <span className="text-zinc-400 text-xs font-normal">Fast Assessment Generation</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-zinc-500" />
              <span className="text-zinc-400 text-xs font-normal">Secure Data Pipelines</span>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Realistic App Mockup Preview */}
        <div className="lg:col-span-6 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full max-w-[580px] rounded-xl bg-[#09090B] border border-zinc-800 shadow-2xl overflow-hidden text-left"
          >
            {/* Mac Browser Header */}
            <div className="bg-[#121214] border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
              </div>
              <div className="text-[10px] text-zinc-500 font-mono tracking-wider bg-black/40 px-6 py-0.5 rounded border border-zinc-800/40">
                edubloom.ai/console
              </div>
              <div className="w-10" />
            </div>

            {/* Mockup Dashboard Grid */}
            <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-5 text-[11px] font-sans">
              
              {/* Left Column: Form config */}
              <div className="md:col-span-6 flex flex-col gap-4 border-r border-zinc-900 pr-0 md:pr-4">
                
                {/* Upload Section */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-zinc-400 font-semibold uppercase tracking-wider text-[9px]">
                    Syllabus Source
                  </span>
                  <div className="border border-dashed border-zinc-800 hover:border-zinc-700 transition-colors p-3 rounded-lg flex flex-col items-center justify-center bg-black/40 text-center cursor-pointer">
                    <UploadCloud className="w-5 h-5 text-zinc-500 mb-1" />
                    <span className="text-[10px] text-zinc-400 font-medium">Click to select files</span>
                    <span className="text-[8px] text-zinc-650 mt-0.5">PDF, DOCX, TXT up to 10MB</span>
                  </div>
                  
                  {/* File preview */}
                  <div className="flex items-center gap-2 p-2 rounded bg-zinc-900 border border-zinc-800 mt-1">
                    <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-[10px] text-zinc-200 font-medium truncate">computer_science_101.pdf</span>
                      <span className="text-[8px] text-zinc-500">4.2 MB • Processing completed</span>
                    </div>
                  </div>
                </div>

                {/* Bloom Sliders */}
                <div className="flex flex-col gap-2">
                  <span className="text-zinc-400 font-semibold uppercase tracking-wider text-[9px]">
                    Taxonomy Settings
                  </span>
                  <div className="flex flex-col gap-1.5 bg-black/45 p-2 rounded-lg border border-zinc-900">
                    <div className="flex justify-between items-center text-[9px]">
                      <span className="text-zinc-400 font-medium">L1-L2 (Remember/Understand)</span>
                      <span className="text-zinc-300 font-mono font-bold">40%</span>
                    </div>
                    <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="bg-zinc-500 h-full w-[40%]" />
                    </div>

                    <div className="flex justify-between items-center text-[9px] mt-1.5">
                      <span className="text-zinc-400 font-medium">L3-L4 (Apply/Analyze)</span>
                      <span className="text-zinc-300 font-mono font-bold">40%</span>
                    </div>
                    <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full w-[40%]" />
                    </div>

                    <div className="flex justify-between items-center text-[9px] mt-1.5">
                      <span className="text-zinc-400 font-medium">L5-L6 (Evaluate/Create)</span>
                      <span className="text-zinc-300 font-mono font-bold">20%</span>
                    </div>
                    <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="bg-zinc-500 h-full w-[20%]" />
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded text-[10px] transition-colors mt-1 select-none">
                  Generate Paper Structure
                </button>
              </div>

              {/* Right Column: Generated output */}
              <div className="md:col-span-6 flex flex-col gap-4 pl-0 md:pl-1">
                
                {/* Header info */}
                <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] text-zinc-300 font-semibold">Assessment Active</span>
                  </div>
                  <span className="text-[9px] text-zinc-500 font-mono bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                    CS_101_MIDTERM
                  </span>
                </div>

                {/* Analytics card */}
                <div className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-850">
                  <span className="text-zinc-500 text-[8px] font-semibold uppercase tracking-wider">
                    Target Cognitive Balanced Rating
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-lg font-bold text-white font-mono">94</span>
                    <span className="text-zinc-500 text-[9px]">/ 100</span>
                  </div>
                </div>

                {/* Question list preview */}
                <div className="flex flex-col gap-2.5">
                  <span className="text-zinc-400 font-semibold uppercase tracking-wider text-[9px]">
                    Drafted Questions (2)
                  </span>

                  {MOCK_QUESTIONS.map((q, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded bg-black border border-zinc-900 flex flex-col gap-1.5"
                    >
                      <div className="flex items-center justify-between text-[8px]">
                        <span className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-900 font-semibold">
                          {q.tag}
                        </span>
                        <span className="text-zinc-500 font-medium">{q.marks}</span>
                      </div>
                      <p className="text-[9px] text-zinc-400 leading-normal font-light">
                        {q.text}
                      </p>
                    </div>
                  ))}
                </div>

              </div>

            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
