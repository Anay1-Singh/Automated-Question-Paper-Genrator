import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'

export default function DifficultyChart() {
  const data = [
    { label: 'Easy', value: 25, color: 'bg-emerald-500', text: 'text-emerald-400', desc: 'Recall & basic comprehension' },
    { label: 'Medium', value: 55, color: 'bg-amber-500', text: 'text-amber-400', desc: 'Application & standard analysis' },
    { label: 'Hard', value: 20, color: 'bg-red-500', text: 'text-red-400', desc: 'Complex evaluation & creation' }
  ]

  return (
    <div className="bg-[#18181B] border border-[#27272A] p-5 rounded-xl flex flex-col justify-between shadow-sm text-left h-full">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-3 border-b border-[#27272A]/70">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-white uppercase tracking-wider">Difficulty Calibration</span>
          <span className="text-[10px] text-zinc-500 font-mono mt-0.5">Target question difficulty weighting</span>
        </div>
        <Activity className="w-4 h-4 text-blue-500" />
      </div>

      {/* Chart Plotting Area */}
      <div className="flex items-end justify-around h-44 border-b border-[#27272A] pb-2 relative mb-6">
        
        {/* Y-axis Ticks Background Lines */}
        <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-between pointer-events-none select-none">
          <div className="border-t border-[#27272A]/30 w-full h-px" />
          <div className="border-t border-[#27272A]/30 w-full h-px" />
          <div className="border-t border-[#27272A]/30 w-full h-px" />
          <div className="border-t border-[#27272A]/30 w-full h-px" />
        </div>

        {/* Dynamic Vertical Columns */}
        {data.map((bar) => (
          <div key={bar.label} className="flex flex-col items-center gap-2.5 z-10 w-16 group relative">
            
            {/* Value popover indicator */}
            <span className={`text-[10px] font-bold ${bar.text} transition-transform duration-200 group-hover:scale-110`}>
              {bar.value}%
            </span>
            
            {/* Animated Column Bar */}
            <div className="w-8 bg-[#09090B] h-28 rounded-t-lg overflow-hidden flex items-end">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${bar.value}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }}
                className={`w-full rounded-t-lg ${bar.color} opacity-90 group-hover:opacity-100 transition-opacity`}
              />
            </div>
            
            {/* Label */}
            <span className="text-[11px] font-bold text-zinc-400">
              {bar.label}
            </span>
            
          </div>
        ))}
      </div>

      {/* Footer Metrics details */}
      <div className="space-y-2">
        {data.map((item) => (
          <div key={item.label} className="flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${item.color}`} />
              <span className="text-zinc-300 font-semibold">{item.label}</span>
            </div>
            <span className="text-zinc-500 italic max-w-[200px] truncate">{item.desc}</span>
          </div>
        ))}
      </div>

    </div>
  )
}
