import { motion } from 'framer-motion'
import { Layers, GraduationCap, BookOpen, Sparkles, ShieldCheck } from 'lucide-react'

export default function Trusted() {
  const integrations = [
    { name: 'Canvas LMS', icon: Layers },
    { name: 'Moodle LMS', icon: GraduationCap },
    { name: 'Blackboard Learn', icon: BookOpen },
    { name: 'D2L Brightspace', icon: Sparkles },
    { name: 'QTI Standards', icon: ShieldCheck }
  ]

  return (
    <section className="bg-[#09090B] py-16 border-b border-[#27272A]/40 px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#A1A1AA]/60 text-center mb-10">
          Supported LMS Integrations & Assessment Standards
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center opacity-40 hover:opacity-60 transition-opacity duration-300">
          {integrations.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors duration-200"
              >
                <Icon className="w-5 h-5 text-blue-500" />
                <span className="font-display font-medium text-sm tracking-tight whitespace-nowrap">
                  {item.name}
                </span>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
