"use client";

import { motion } from "framer-motion";
import { FEATURES } from "@/constants/content";
import Card from "@/components/common/Card";

export default function Features() {
  return (
    <section id="features" className="relative py-24 md:py-32 bg-black">
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
              Platform Features
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
              Curate balanced exams with complete cognitive control.
            </h3>
            <p className="mt-4 text-sm md:text-base text-zinc-400 font-light leading-relaxed max-w-2xl">
              Harness language models trained on curriculum blueprints to parse textbook chapters and draft questions aligned with target educational outcomes.
            </p>
          </motion.div>
        </div>

        {/* Feature Cards Grid (3x2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            
            return (
              <Card
                key={feature.title}
                delay={index * 0.04}
                hoverBorder={true}
                className="group flex flex-col justify-between h-[230px]"
              >
                {/* Feature Icon */}
                <div className="w-fit mb-6 text-zinc-400 group-hover:text-blue-500 transition-colors duration-200">
                  <Icon className="w-5 h-5" />
                </div>

                {/* Feature Text */}
                <div className="flex-1 flex flex-col justify-end">
                  <h4 className="text-white font-semibold text-base mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-zinc-400 text-xs leading-relaxed font-light">
                    {feature.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
