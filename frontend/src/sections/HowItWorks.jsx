"use client";

import { motion } from "framer-motion";
import { STEPS } from "@/constants/content";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 md:py-32 bg-black">
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
              Execution Flow
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
              A structured pipeline from notes to exam papers.
            </h3>
            <p className="mt-4 text-sm md:text-base text-zinc-400 font-light leading-relaxed max-w-2xl">
              Upload source materials, specify parameter settings, and let the parser structure cognitive items dynamically.
            </p>
          </motion.div>
        </div>

        {/* Timeline Flow */}
        <div className="relative grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Connector Line behind steps (Desktop only) */}
          <div className="hidden md:block absolute top-7 left-[10%] right-[10%] h-[1px] bg-zinc-800 z-0" />

          {STEPS.map((step, index) => {
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="relative z-10 flex flex-col items-start text-left group"
              >
                {/* Step Circle Indicator */}
                <div className="w-14 h-14 rounded-full border border-zinc-800 bg-[#09090B] flex items-center justify-center text-sm font-mono font-bold text-zinc-400 mb-5 group-hover:border-blue-600 group-hover:text-white transition-colors duration-200">
                  {step.number}
                </div>

                {/* Step Details */}
                <h4 className="text-white font-semibold text-sm mb-2">
                  {step.title}
                </h4>
                <p className="text-zinc-400 text-xs leading-relaxed font-light">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
