"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

export default function Card({
  children,
  className,
  hoverBorder = true,
  delay = 0,
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, delay }}
      whileHover={hoverBorder ? { y: -2, transition: { duration: 0.15 } } : {}}
      className={cn(
        "relative rounded-xl bg-[#09090B] border border-zinc-800 p-6 md:p-8 overflow-hidden transition-colors duration-200",
        hoverBorder && "hover:border-blue-600 hover:shadow-[0_4px_20px_rgba(37,99,235,0.05)]",
        className
      )}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
