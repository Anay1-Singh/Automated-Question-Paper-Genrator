"use client";

import { motion } from "framer-motion";
import { TRUSTED_UNIVERSITIES } from "@/constants/content";

export default function Trust() {
  return (
    <section className="bg-black border-y border-zinc-900 py-10 relative z-10 select-none">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-zinc-500 text-center mb-8">
          Trusted by instructors and administrators at leading institutions
        </p>
        
        {/* Grayscale text-based logo grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 items-center justify-items-center">
          {TRUSTED_UNIVERSITIES.map((uni, idx) => (
            <motion.div
              key={uni.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.4 }}
              whileHover={{ opacity: 0.8 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="text-white text-sm font-bold tracking-widest font-mono text-center px-4"
              title={uni.code}
            >
              {uni.name.toUpperCase()}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
