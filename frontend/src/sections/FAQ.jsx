"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { FAQ_DATA } from "@/constants/content";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <section id="faq" className="relative py-24 md:py-32 bg-black border-t border-zinc-900">
      <div className="max-w-4xl mx-auto px-6 md:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-3 select-none">
              Questions & Answers
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
              Frequently Asked Questions
            </h3>
            <p className="mt-4 text-sm md:text-base text-zinc-400 font-light leading-relaxed">
              Find answers to common questions about our AI parser, Bloom's categorization, and export settings.
            </p>
          </motion.div>
        </div>

        {/* FAQ Accordion List */}
        <div className="flex flex-col gap-4">
          {FAQ_DATA.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="border border-zinc-850 rounded-lg bg-[#09090B] overflow-hidden transition-colors duration-150 hover:border-zinc-800"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="text-white font-medium text-sm md:text-base">
                    {item.question}
                  </span>
                  <div className="text-zinc-500 hover:text-white shrink-0 ml-4">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-1 border-t border-zinc-900 text-zinc-450 text-xs md:text-sm leading-relaxed font-light">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
