import { motion } from 'framer-motion'
import {
  Cpu,
  Layers,
  Activity,
  Database,
  FileDown,
  LineChart,
  CheckCircle
} from 'lucide-react'

export default function Features() {
  const features = [
    {
      title: 'AI Question Generation',
      description: 'Generate high-fidelity, contextual questions from any textbook, syllabus, or lecture slides within seconds using advanced NLP models.',
      icon: Cpu,
      highlights: ['Multiple Choice', 'Short Answer', 'Descriptive']
    },
    {
      title: "Bloom's Taxonomy Mapping",
      description: "Automatically categorize and distribute questions across cognitive levels—from Recall/Remember to complex Evaluate & Create stages.",
      icon: Layers,
      highlights: ['Cognitive Weighting', 'Action Verbs', 'Curriculum Mapping']
    },
    {
      title: 'Difficulty Level Balancer',
      description: 'Configure and balance the exact ratios of Easy, Medium, and Hard questions in accordance with your university guidelines.',
      icon: Activity,
      highlights: ['Dynamic Calibration', 'Syllabus Coverage', 'Custom Thresholds']
    },
    {
      title: 'Smart Question Bank',
      description: 'Store, tag, and organize thousands of questions. Filter by topic, cognitive level, marks, or year of appearance.',
      icon: Database,
      highlights: ['Full Metadata', 'Fast Search', 'Version Control']
    },
    {
      title: 'Seamless PDF & LMS Export',
      description: 'Instantly download beautifully formatted question papers as PDFs or export to Canvas, Blackboard, or Moodle (QTI format).',
      icon: FileDown,
      highlights: ['PDF Templates', 'LMS Import', 'Word / LaTeX support']
    },
    {
      title: 'Analytics Dashboard',
      description: 'Visualize question bank coverage, exam difficulty over time, syllabus completion rates, and learning outcomes in real time.',
      icon: LineChart,
      highlights: ['Coverage Charts', 'Quality Audit Logs', 'Student Statistics']
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  }

  return (
    <section id="features" className="bg-[#09090B] py-24 md:py-32 px-6 md:px-8 border-b border-[#27272A]/40 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4 tracking-tight">
            Designed for Modern Academic Standards
          </h2>
          <p className="text-[#A1A1AA] text-lg">
            Everything your department needs to build high-quality, balanced, and syllabus-compliant assessments in a fraction of the time.
          </p>
        </div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feat) => {
            const Icon = feat.icon
            return (
              <motion.div
                key={feat.title}
                variants={cardVariants}
                whileHover={{ y: -5, borderColor: '#3B82F6' }}
                className="bg-[#18181B] border border-[#27272A] p-6 rounded-xl text-left transition-colors duration-300 relative group flex flex-col justify-between h-full"
              >
                <div>
                  {/* Icon Wrapper */}
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mb-6 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="font-display font-semibold text-lg text-white mb-3 tracking-tight">
                    {feat.title}
                  </h3>
                  
                  <p className="text-sm text-[#A1A1AA] leading-relaxed mb-6">
                    {feat.description}
                  </p>
                </div>

                {/* Bullet Tags */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-[#27272A]/60">
                  {feat.highlights.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-[10px] font-semibold text-white bg-black/45 border border-[#27272A] px-2.5 py-1 rounded"
                    >
                      <CheckCircle className="w-2.5 h-2.5 text-blue-500" />
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
