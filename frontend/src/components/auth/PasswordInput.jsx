import { useState } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { motion } from 'framer-motion'

export default function PasswordInput({
  label,
  id,
  error,
  success,
  disabled,
  required = false,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex flex-col gap-2 text-left w-full">
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold text-zinc-300 select-none tracking-wide"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {/* Left Lock Icon */}
        <div className={`absolute left-3.5 pointer-events-none transition-colors duration-200 ${
          error ? 'text-red-500' : success ? 'text-green-500' : 'text-zinc-500'
        }`}>
          <Lock className="w-4 h-4" />
        </div>

        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          disabled={disabled}
          required={required}
          className={`w-full bg-[#09090B] border text-xs sm:text-sm text-white placeholder-zinc-500 rounded-xl py-3.5 pl-11 pr-11 transition-all duration-200 shadow-sm font-sans ${
            error
              ? 'border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500'
              : success
              ? 'border-green-500/80 focus:border-green-500 focus:ring-1 focus:ring-green-500'
              : 'border-[#27272A] hover:border-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
          } ${disabled ? 'opacity-40 cursor-not-allowed bg-zinc-900/40' : ''}`}
          {...props}
        />

        {/* Right Visibility Toggle Button */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3.5 p-1 text-zinc-500 hover:text-white rounded-lg hover:bg-zinc-800/40 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
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
