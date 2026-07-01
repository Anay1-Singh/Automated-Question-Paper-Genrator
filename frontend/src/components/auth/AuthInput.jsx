import { motion } from 'framer-motion'

export default function AuthInput({
  label,
  id,
  type = 'text',
  icon: Icon,
  error,
  success,
  disabled,
  className = '',
  required = false,
  ...props
}) {
  return (
    <div className={`flex flex-col gap-2 text-left w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold text-zinc-300 select-none tracking-wide"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative flex items-center">
        {Icon && (
          <div className={`absolute left-3.5 pointer-events-none transition-colors duration-200 ${
            error ? 'text-red-500' : success ? 'text-green-500' : 'text-zinc-500'
          }`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
        
        <input
          id={id}
          type={type}
          disabled={disabled}
          required={required}
          className={`w-full bg-[#09090B] border text-xs sm:text-sm text-white placeholder-zinc-500 rounded-xl py-3.5 transition-all duration-200 shadow-sm font-sans ${
            Icon ? 'pl-11 pr-4' : 'px-4'
          } ${
            error
              ? 'border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500'
              : success
              ? 'border-green-500/80 focus:border-green-500 focus:ring-1 focus:ring-green-500'
              : 'border-[#27272A] hover:border-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
          } ${disabled ? 'opacity-40 cursor-not-allowed bg-zinc-900/40' : ''}`}
          {...props}
        />
      </div>

      {error && (
        <motion.span
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] font-semibold text-red-400 mt-1 block font-mono"
        >
          {error}
        </motion.span>
      )}
    </div>
  )
}
