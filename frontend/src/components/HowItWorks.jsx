import { motion } from 'framer-motion'
import { FileUp, Eye, Wrench, Download } from 'lucide-react'

export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Upload Study Material',
      description: 'Upload course syllabi, textbooks, reference papers, or lecture notes. Our engine supports PDF, DOCX, and raw text files.',
      icon: FileUp,
      details: 'Supported sizes up to 100MB'
    },
    {
      step: '02',
      title: 'AI Cognitive Parsing',
      description: 'PaperMind analyzes the topics and constructs a deep semantic representation of the syllabus using NLP and Bloom\'s Taxonomy rules.',
      icon: Eye,
      details: 'Identifies core cognitive requirements'
    },
    {
      step: '03',
      title: 'Generate & Calibrate Questions',
      description: 'Define your desired difficulty curves, marks configuration, and Bloom level percentages. Review and modify questions interactively.',
      icon: Wrench,
      details: 'Automatic answer key generated'
    },
    {
      step: '04',
      title: 'Export PDF or LMS Sync',
      description: 'Download the final question paper in print-ready PDF format (with LaTeX mathematical formulas) or sync with Canvas and Moodle.',
      icon: Download,
      details: 'Format matches university templates'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const stepVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  }

  return (
    <section id="how-it-works" className="bg-[#09090B] py-24 md:py-32 px-6 md:px-8 border-b border-[#27272A]/40 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4 tracking-tight">
            How It Works
          </h2>
          <p className="text-[#A1A1AA] text-lg">
            Create balanced, rigorous, and syllabus-compliant question papers in four simple steps.
          </p>
        </div>

        {/* Steps Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative"
        >
          {/* Horizontal Connector Line for Desktop */}
          <div className="hidden lg:block absolute top-[44px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-blue-500/20 via-blue-500 to-indigo-500/20 z-0" />

          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.step}
                variants={stepVariants}
                className="flex flex-col items-center lg:items-start text-center lg:text-left relative z-10"
              >
                {/* Step Circle */}
                <div className="w-22 h-22 rounded-full bg-[#18181B] border-2 border-[#27272A] flex items-center justify-center text-white mb-6 relative group-hover:border-blue-500 transition-colors duration-300 shadow-xl">
                  {/* Outer glowing effect */}
                  <div className="absolute inset-0 rounded-full bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="w-12 h-12 rounded-full bg-blue-500/5 border border-blue-500/10 flex items-center justify-center text-blue-500">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                {/* Step Label */}
                <span className="text-[11px] font-mono font-bold tracking-widest text-blue-500 uppercase mb-2">
                  Step {step.step}
                </span>

                {/* Step Content */}
                <h3 className="font-display font-bold text-lg text-white mb-3">
                  {step.title}
                </h3>
                
                <p className="text-sm text-[#A1A1AA] leading-relaxed mb-4 max-w-sm">
                  {step.description}
                </p>

                <span className="text-[10px] text-zinc-500 font-mono mt-auto">
                  {step.details}
                </span>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
