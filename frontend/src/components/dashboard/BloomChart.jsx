import { motion } from 'framer-motion'
import { Layers } from 'lucide-react'

export default function BloomChart() {
  const distribution = [
    { name: 'Create', value: 10, target: 15, color: 'bg-red-500', border: 'border-red-500/20', text: 'text-red-400' },
    { name: 'Evaluate', value: 15, target: 15, color: 'bg-orange-500', border: 'border-orange-500/20', text: 'text-orange-400' },
    { name: 'Analyze', value: 20, target: 20, color: 'bg-yellow-500', border: 'border-yellow-500/20', text: 'text-yellow-400' },
    { name: 'Apply', value: 30, target: 25, color: 'bg-green-500', border: 'border-green-500/20', text: 'text-green-400' },
    { name: 'Understand', value: 15, target: 15, color: 'bg-blue-500', border: 'border-blue-500/20', text: 'text-blue-400' },
    { name: 'Remember', value: 10, target: 10, color: 'bg-zinc-500', border: 'border-zinc-500/20', text: 'text-zinc-400' }
  ]

  // SVG parameters for standard donut/ring
  const radius = 50
  const circumference = 2 * Math.PI * radius
  const complianceScore = 96
  const strokeDashoffset = circumference - (complianceScore / 100) * circumference

  return (
    <div className="bg-[#18181B] border border-[#27272A] p-5 rounded-xl flex flex-col justify-between shadow-sm text-left h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-5 pb-3 border-b border-[#27272A]/70">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-white uppercase tracking-wider">Cognitive Distribution</span>
          <span className="text-[10px] text-zinc-500 font-mono mt-0.5">Bloom's Taxonomy mapping profile</span>
        </div>
        <Layers className="w-4 h-4 text-blue-500" />
      </div>

      {/* Content Columns: Stacked Centered */}
      <div className="flex flex-col gap-6 items-center">
        
        {/* Top: SVG Circle Donut */}
        <div className="flex flex-col items-center justify-center relative shrink-0">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            {/* Background circle track */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              className="stroke-[#27272A]/60"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Foreground circle fill */}
            <motion.circle
              cx="60"
              cy="60"
              r={radius}
              className="stroke-blue-500"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              strokeLinecap="round"
            />
          </svg>
          
          {/* Circular Text HUD */}
          <div className="absolute inset-0 flex flex-col items-center justify-center mt-[-4px]">
            <span className="text-xl font-extrabold text-white leading-none tracking-tight">{complianceScore}%</span>
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Compliance</span>
          </div>
        </div>

        {/* Bottom: Bloom Progress Bars */}
        <div className="w-full flex flex-col gap-3">
          {distribution.map((item) => (
            <div key={item.name} className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-white">{item.name}</span>
                <span className="text-zinc-500 font-mono">
                  <span className={item.text}>{item.value}%</span> / {item.target}%
                </span>
              </div>
              
              <div className="w-full bg-[#09090B] h-1.5 rounded-full overflow-hidden relative">
                {/* Target line ticks indicator */}
                <div
                  className="absolute top-0 bottom-0 w-[1.5px] bg-zinc-600 z-10"
                  style={{ left: `${item.target}%` }}
                  title={`Target: ${item.target}%`}
                />
                
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={`h-full rounded-full ${item.color}`}
                />
              </div>
            </div>
          ))}
        </div>

      </div>

      <div className="mt-4 pt-3 border-t border-[#27272A]/50 text-[10px] text-zinc-500 leading-normal">
        * Vertical bars in grid mark the required blueprint syllabus target weights.
      </div>

    </div>
  )
}
