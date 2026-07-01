import { motion } from 'framer-motion'
import { CheckCircle2, BrainCircuit } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AuthLayout({
  children,
  headline,
  subtitle
}) {
  const features = [
    'AI-Powered Exam Generation',
    'Bloom\'s Taxonomy Matrix Mapping',
    'Real-time Assessment Analytics',
    'Secure Multi-User Workspace'
  ]

  return (
    <div className="min-h-screen bg-[#09090B] text-white flex flex-col lg:grid lg:grid-cols-12 overflow-x-hidden font-sans relative">
      
      {/* Background Subtle Animated Orbs */}
      <div className="absolute top-[20%] left-[-10%] w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Left Column - Product Branding Banner */}
      <div className="lg:col-span-5 flex flex-col justify-between p-8 sm:p-16 border-b lg:border-b-0 lg:border-r border-[#27272A]/70 bg-[#09090B]/40 relative overflow-hidden shrink-0">
        
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-[0.02] grid-bg pointer-events-none" />

        {/* Brand Header */}
        <Link
          to="/"
          className="flex items-center gap-2.5 self-start group z-10 focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
        >
          <div className="p-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg group-hover:border-blue-500/40 transition-colors duration-300">
            <BrainCircuit className="w-5 h-5 text-blue-500" />
          </div>
          <span className="font-display font-bold text-lg text-white">
            PaperMind<span className="text-blue-500">.ai</span>
          </span>
        </Link>

        {/* Marketing Center */}
        <div className="my-12 lg:my-auto z-10">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white tracking-tight leading-tight mb-4"
          >
            {headline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-sm sm:text-base text-zinc-400 mb-8 max-w-sm"
          >
            {subtitle}
          </motion.p>

          {/* Verification Checklist */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1, delayChildren: 0.2 }
              }
            }}
            className="flex flex-col gap-4 text-left"
          >
            {features.map((feat) => (
              <motion.div
                key={feat}
                variants={{
                  hidden: { opacity: 0, x: -10 },
                  visible: { opacity: 1, x: 0 }
                }}
                className="flex items-center gap-3 text-xs sm:text-sm text-zinc-300"
              >
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="font-medium">{feat}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Footer info */}
        <div className="text-[10px] text-zinc-600 font-mono z-10 hidden lg:block">
          &copy; {new Date().getFullYear()} PaperMind AI. Enterprise Grade Security Compliance.
        </div>
      </div>

      {/* Right Column - Authentication Card Portal */}
      <div className="lg:col-span-7 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 18 }}
          className="w-full max-w-[440px] bg-[#18181B] border border-[#27272A] rounded-2xl p-6 sm:p-10 shadow-2xl relative"
        >
          {children}
        </motion.div>
      </div>

    </div>
  )
}
