import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, BrainCircuit } from 'lucide-react'

export default function CTA() {
  return (
    <section id="contact" className="bg-[#09090B] py-24 md:py-32 px-6 md:px-8 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-tr from-[#18181B] to-[#1e1e24] border border-[#27272A] rounded-2xl p-8 md:p-16 text-center flex flex-col items-center relative overflow-hidden"
        >
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 opacity-[0.03] grid-bg pointer-events-none" />

          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mb-6">
            <BrainCircuit className="w-6 h-6" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight mb-4 max-w-2xl">
            Start Generating Smarter Question Papers Today
          </h2>

          <p className="text-sm sm:text-base text-[#A1A1AA] mb-8 max-w-lg leading-relaxed">
            Join hundreds of departments automating exam creation while maintaining curriculum compliance and cognitive rigor.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 px-6 py-3.5 rounded-lg shadow-lg shadow-blue-900/20 hover:shadow-blue-900/30 hover:-translate-y-0.5 transition-all duration-200"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#contact-sales"
              className="inline-flex items-center justify-center gap-2.5 text-sm font-semibold text-white border border-[#27272A] hover:bg-[#18181B] px-6 py-3.5 rounded-lg transition-colors duration-200"
            >
              Request Department Demo
            </a>
          </div>

          {/* SLA badge */}
          <span className="text-[10px] text-zinc-500 font-mono mt-8">
            Fully compatible with Canvas, Moodle, and Blackboard LMS.
          </span>
        </motion.div>
      </div>
    </section>
  )
}
