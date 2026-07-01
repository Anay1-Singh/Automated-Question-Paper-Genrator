"use client";

import { motion } from "framer-motion";
import { BENEFITS } from "@/constants/content";
import Card from "@/components/common/Card";

const STATS = [
  { value: "90%", label: "Prep Time Reduced" },
  { value: "1,000+", label: "Questions Processed" },
  { value: "6 Tiers", label: "Bloom Taxonomy Levels" }
];

export default function Benefits() {
  return (
    <section id="benefits" className="relative py-24 md:py-32 bg-black border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column - Stats */}
          <div className="lg:col-span-5 flex flex-col justify-center sticky top-28">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-3 select-none">
              Platform Benefits
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
              Built to support academic integrity and rigour.
            </h3>
            <p className="mt-4 text-sm md:text-base text-zinc-400 font-light leading-relaxed">
              We facilitate strict curriculum standards. Instructors save grading and test formulation hours while assuring cognitive diversity across midterms and finals.
            </p>

            {/* Flat metrics list */}
            <div className="mt-12 grid grid-cols-3 gap-4 pt-8 border-t border-zinc-900">
              {STATS.map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="flex flex-col text-left"
                >
                  <span className="text-2xl md:text-3xl font-mono font-bold text-white">
                    {stat.value}
                  </span>
                  <span className="text-zinc-500 text-[9px] font-semibold tracking-wider uppercase mt-1 leading-snug">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column - Benefits Cards List */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {BENEFITS.map((benefit, index) => {
              const Icon = benefit.icon;

              return (
                <Card
                  key={benefit.title}
                  delay={index * 0.04}
                  hoverBorder={true}
                  className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between p-5 md:p-6"
                >
                  <div className="flex gap-4 items-center">
                    <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-850 text-zinc-400 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm">
                        {benefit.title}
                      </h4>
                      <p className="text-zinc-400 text-xs mt-1 leading-relaxed font-light">
                        {benefit.description}
                      </p>
                    </div>
                  </div>

                  {/* Minimal metric badge */}
                  <div className="shrink-0 px-2.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[8px] font-mono font-bold text-zinc-400 uppercase tracking-widest self-start sm:self-auto select-none">
                    {benefit.metric}
                  </div>
                </Card>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
