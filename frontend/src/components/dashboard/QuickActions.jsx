import { motion } from 'framer-motion'
import { FilePlus, FileUp, Database, FileDown, BarChart3 } from 'lucide-react'

export default function QuickActions({
  onGenerateClick,
  onUploadClick,
  onBrowseBankClick,
  onDownloadClick,
  onAnalyticsClick
}) {
  const actions = [
    {
      label: 'Generate New Paper',
      description: 'Define syllabus parameters, marks, and configure difficulty.',
      icon: FilePlus,
      color: 'text-blue-500 bg-blue-500/5 border-blue-500/15',
      onClick: onGenerateClick
    },
    {
      label: 'Upload Course Material',
      description: 'Upload textbook chapters or transcripts for parsing.',
      icon: FileUp,
      color: 'text-emerald-500 bg-emerald-500/5 border-emerald-500/15',
      onClick: onUploadClick
    },
    {
      label: 'Browse Question Bank',
      description: 'Review and catalog generated taxonomy questions.',
      icon: Database,
      color: 'text-purple-500 bg-purple-500/5 border-purple-500/15',
      onClick: onBrowseBankClick
    },
    {
      label: 'Download Papers',
      description: 'Access compiled exam sheets and LaTeX source files.',
      icon: FileDown,
      color: 'text-orange-500 bg-orange-500/5 border-orange-500/15',
      onClick: onDownloadClick
    },
    {
      label: 'View Assessment Analytics',
      description: 'Audit cognitive coverage metrics over semesters.',
      icon: BarChart3,
      color: 'text-pink-500 bg-pink-500/5 border-pink-500/15',
      onClick: onAnalyticsClick
    }
  ]

  return (
    <div className="flex flex-col gap-4 text-left">
      <div className="flex flex-col">
        <span className="text-xs font-bold text-white uppercase tracking-wider">Quick Actions</span>
        <span className="text-[10px] text-zinc-500 font-mono mt-0.5">Automated workspace tasks</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((act) => {
          const Icon = act.icon
          return (
            <motion.button
              key={act.label}
              onClick={act.onClick}
              whileHover={{ y: -3, borderColor: '#3B82F6' }}
              className="bg-[#18181B] border border-[#27272A] p-5 rounded-xl text-left transition-colors duration-200 flex gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 group"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${act.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              
              <div className="flex flex-col justify-center">
                <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-blue-500 transition-colors leading-tight mb-1">
                  {act.label}
                </h4>
                <p className="text-[11px] text-[#A1A1AA] leading-normal">
                  {act.description}
                </p>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
