"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Button from "@/components/common/Button";

export default function CTA() {
  return (
    <section className="relative py-24 md:py-32 bg-black border-t border-zinc-900 select-none">
      <div className="max-w-5xl mx-auto px-6 md:px-8 relative z-10 text-center">
        
        {/* Simple details */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center gap-6"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight max-w-2xl">
            Ready to automate question paper generation?
          </h2>

          <p className="text-zinc-400 text-sm md:text-base font-light leading-relaxed max-w-lg">
            Create a free account and begin drafting curriculum-aligned test sheets under cognitive taxonomy rules in minutes.
          </p>

          <div className="mt-4 flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <Link href="/signup">
              <Button variant="primary" className="py-3 px-8 text-sm gap-1.5 font-semibold">
                Start Now <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
            <Button variant="secondary" className="py-3 px-8 text-sm font-medium">
              Schedule Sales Demo
            </Button>
          </div>
          
          <span className="text-zinc-600 text-[10px] uppercase tracking-wider font-semibold">
            Institutional licensing available • 14-day evaluation trial
          </span>
        </motion.div>

      </div>
    </section>
  );
}
