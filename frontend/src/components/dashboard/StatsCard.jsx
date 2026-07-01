import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatsCard({
  label,
  value,
  icon: Icon,
  growth,
  trend = 'up',
  description
}) {
  return (
    <motion.div
      whileHover={{ y: -4, borderColor: '#3B82F6' }}
      className="bg-[#18181B] border border-[#27272A] p-5 rounded-xl text-left transition-all duration-300 relative group flex flex-col justify-between shadow-sm overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/0 to-blue-500/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Top Details Header */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <span className="text-xs font-semibold text-[#A1A1AA] select-none tracking-wide">
          {label}
        </span>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-blue-500/5 border border-blue-500/10 flex items-center justify-center text-blue-500">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Main Stats Value */}
      <div className="flex items-baseline justify-between gap-2 mt-1 relative z-10">
        <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight leading-none">
          {value}
        </h3>

        {/* Growth/Trend badge */}
        {growth && (
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${
            trend === 'up'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-red-500/10 text-red-400 border-red-500/20'
          }`}>
            {trend === 'up' ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {growth}
          </span>
        )}
      </div>

      {/* Footer details description */}
      {description && (
        <p className="text-[10px] text-zinc-500 font-mono mt-3 select-none leading-normal">
          {description}
        </p>
      )}

    </motion.div>
  )
}
