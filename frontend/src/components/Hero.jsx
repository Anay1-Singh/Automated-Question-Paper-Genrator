import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { UploadCloud, CheckCircle2, Play, ArrowRight, BrainCircuit, BarChart3, Layers, FileText } from 'lucide-react'

export default function Hero() {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  }

  const bloomLevels = [
    { name: 'Create', color: 'bg-red-500/20 text-red-400 border-red-500/30', width: 'w-1/3', desc: 'Design, Construct, Formulate', pct: '15%' },
    { name: 'Evaluate', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', width: 'w-5/12', desc: 'Appraise, Critique, Defend', pct: '15%' },
    { name: 'Analyze', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', width: 'w-1/2', desc: 'Differentiate, Organize', pct: '20%' },
    { name: 'Apply', color: 'bg-green-500/20 text-green-400 border-green-500/30', width: 'w-7/12', desc: 'Execute, Implement, Solve', pct: '25%' },
    { name: 'Understand', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', width: 'w-8/12', desc: 'Classify, Describe, Discuss', pct: '15%' },
    { name: 'Remember', color: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30', width: 'w-full', desc: 'Recall, Define, List', pct: '10%' }
  ]

  return (
    <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden bg-[#09090B] px-6 md:px-8 border-b border-[#27272A]/40">
      {/* Background Accent Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Left Side: Headline & Copy */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-6 flex flex-col items-start text-left"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/25 bg-blue-500/5 text-blue-400 text-xs font-semibold tracking-wide uppercase mb-6"
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>AI-Driven Assessment Engine</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white tracking-tight leading-[1.1] mb-6"
          >
            Generate University-Level Question Papers <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-400">with AI</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-[#A1A1AA] font-normal leading-relaxed mb-8 max-w-xl"
          >
            Upload your study material and let AI generate curriculum-aligned question papers mapped to Bloom's Taxonomy within seconds.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
          >
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 px-6 py-3.5 rounded-lg shadow-lg shadow-blue-900/20 hover:shadow-blue-900/30 hover:-translate-y-0.5 transition-all duration-200"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#demo"
              className="inline-flex items-center justify-center gap-2.5 text-sm font-semibold text-white border border-[#27272A] hover:bg-[#18181B] px-6 py-3.5 rounded-lg transition-colors duration-200"
            >
              <Play className="w-4 h-4 text-blue-500 fill-blue-500" />
              Watch Demo
            </a>
          </motion.div>

          {/* Core Benefit Badges */}
          <motion.div
            variants={itemVariants}
            className="mt-12 pt-8 border-t border-[#27272A]/80 w-full grid grid-cols-3 gap-6 text-zinc-500 text-xs font-semibold tracking-wider uppercase"
          >
            <div>
              <span className="block text-white text-lg font-bold mb-1">99%</span>
              LMS COMPATIBLE
            </div>
            <div>
              <span className="block text-white text-lg font-bold mb-1">100%</span>
              BLOOM ALIGNED
            </div>
            <div>
              <span className="block text-white text-lg font-bold mb-1">&lt; 10s</span>
              GENERATION TIME
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side: Complex HTML/CSS SaaS Dashboard Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="lg:col-span-6 relative flex justify-center"
        >
          {/* Main Showcase Panel */}
          <div className="w-full max-w-[560px] bg-[#18181B] border border-[#27272A] rounded-xl p-5 shadow-2xl relative overflow-hidden grid-bg">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/2 to-indigo-500/2 pointer-events-none" />

            {/* Dashboard Header Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-[#27272A] mb-5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#27272A]" />
                <div className="w-3 h-3 rounded-full bg-[#27272A]" />
                <div className="w-3 h-3 rounded-full bg-[#27272A]" />
              </div>
              <div className="text-[11px] font-mono text-zinc-500 bg-black/30 border border-[#27272A]/40 px-3 py-1 rounded">
                console.papermind.ai/dashboard
              </div>
              <div className="w-12" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column Widgets */}
              <div className="flex flex-col gap-4">
                {/* File Upload Widget */}
                <div className="bg-[#09090B] border border-[#27272A] rounded-lg p-4 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                  <UploadCloud className="w-8 h-8 text-blue-500 mb-2.5" />
                  <span className="text-xs font-semibold text-white">Syllabus_Unit_3.pdf</span>
                  <span className="text-[10px] text-zinc-500 mt-0.5">Size: 4.2 MB</span>

                  {/* Simulated Uploading/Completed Progress bar */}
                  <div className="w-full bg-[#27272A] h-1.5 rounded-full overflow-hidden mt-3.5">
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity, repeatDelay: 2 }}
                      className="bg-blue-500 h-full rounded-full"
                    />
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-emerald-400 text-[10px] font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Analyzed & Processed</span>
                  </div>
                </div>

                {/* Floating Stats Widget */}
                <div className="bg-[#09090B] border border-[#27272A] rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-semibold text-white">Paper Statistics</span>
                    <BarChart3 className="w-3.5 h-3.5 text-zinc-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#18181B] border border-[#27272A]/50 p-2 rounded text-left">
                      <span className="text-[10px] text-zinc-400 block mb-0.5">Total Qs</span>
                      <span className="text-sm font-bold text-white">45 Items</span>
                    </div>
                    <div className="bg-[#18181B] border border-[#27272A]/50 p-2 rounded text-left">
                      <span className="text-[10px] text-zinc-400 block mb-0.5">Total Marks</span>
                      <span className="text-sm font-bold text-white">100 Pts</span>
                    </div>
                  </div>
                  <div className="mt-3 text-left">
                    <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-1">
                      <span>Avg. Difficulty</span>
                      <span className="text-blue-400 font-semibold">Medium</span>
                    </div>
                    <div className="w-full bg-[#27272A] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-emerald-500 via-blue-500 to-red-500 h-full rounded-full" style={{ width: '65%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Bloom's Taxonomy Pyramid */}
              <div className="bg-[#09090B] border border-[#27272A] rounded-lg p-4 flex flex-col">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-semibold text-white">Bloom Distribution</span>
                  <Layers className="w-3.5 h-3.5 text-blue-500" />
                </div>
                {/* Pyramid stack */}
                <div className="flex flex-col gap-1.5 flex-grow items-center justify-center">
                  {bloomLevels.map((lvl) => (
                    <div
                      key={lvl.name}
                      className={`text-[9px] font-semibold py-1 px-2 border rounded-md transition-all duration-300 hover:scale-105 cursor-pointer text-center relative ${lvl.width} ${lvl.color}`}
                      title={`${lvl.name}: ${lvl.desc}`}
                    >
                      <div className="flex items-center justify-between px-1">
                        <span>{lvl.name}</span>
                        <span className="opacity-80">{lvl.pct}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Generated Question Preview Panel */}
            <div className="mt-4 bg-[#09090B] border border-[#27272A] rounded-lg p-3 text-left">
              <div className="flex items-center justify-between pb-2 border-b border-[#27272A]/50 mb-2">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-xs font-semibold text-white">Live Generation Feed</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-semibold text-emerald-400 uppercase">Interactive</span>
                </div>
              </div>
              <div className="text-[11px] text-zinc-300 font-mono space-y-2 max-h-[85px] overflow-y-auto pr-1">
                <div className="bg-[#18181B]/60 p-2 border border-[#27272A]/40 rounded">
                  <div className="flex justify-between text-[9px] text-zinc-500 mb-1">
                    <span className="text-yellow-400">Analyze • Part C</span>
                    <span>Q2 • 15 Marks</span>
                  </div>
                  "Analyze the impact of self-attention mechanics on transformer latency compared to recurrent networks."
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
