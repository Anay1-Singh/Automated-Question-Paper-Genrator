import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, ArrowRight } from 'lucide-react'
import AuthInput from './AuthInput'
import PasswordInput from './PasswordInput'
import SocialButton from './SocialButton'
import { api } from '../../utils/api'

export default function LoginForm() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors = {}
    
    // Email Validation
    if (!email) {
      newErrors.email = 'Email address is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Password Validation
    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const data = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', data.access_token)
      navigate('/dashboard')
    } catch (err) {
      setFormError(err.message || 'Invalid credentials or connection error.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full text-left" noValidate>
      
      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">Welcome Back</h2>
        <p className="text-xs text-zinc-400">Enter your credentials to access your academic portal.</p>
      </div>

      {formError && (
        <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 font-semibold">
          {formError}
        </div>
      )}

      <div className="flex flex-col gap-4">
        {/* Email Input */}
        <AuthInput
          label="Email Address"
          id="login-email"
          type="email"
          icon={Mail}
          placeholder="name@university.edu"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (errors.email) setErrors({ ...errors, email: null })
          }}
          error={errors.email}
          disabled={isSubmitting}
          required
        />

        {/* Password Input */}
        <div className="flex flex-col gap-1.5">
          <PasswordInput
            label="Password"
            id="login-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (errors.password) setErrors({ ...errors, password: null })
            }}
            error={errors.password}
            disabled={isSubmitting}
            required
          />
        </div>
      </div>

      {/* Options Row: Remember Me & Forgot Password */}
      <div className="flex items-center justify-between text-xs font-semibold">
        <label className="flex items-center gap-2 text-zinc-400 hover:text-white cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={isSubmitting}
            className="w-4 h-4 rounded bg-[#09090B] border border-[#27272A] text-blue-600 focus:ring-blue-500 focus:ring-offset-[#18181B] accent-blue-600"
          />
          Remember me
        </label>
        <Link
          to="/forgot-password"
          className="text-blue-500 hover:text-blue-400 transition-colors focus-visible:underline focus:outline-none"
        >
          Forgot password?
        </Link>
      </div>

      {/* Submit Action Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white text-xs sm:text-sm font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-900/10 hover:shadow-blue-900/25 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed hover:-translate-y-0.5"
      >
        {isSubmitting ? 'Verifying...' : 'Sign In'}
        {!isSubmitting && <ArrowRight className="w-4 h-4" />}
      </button>

      {/* Divider */}
      <div className="relative flex items-center justify-center my-1.5">
        <div className="absolute inset-x-0 h-px bg-[#27272A]/70" />
        <span className="relative bg-[#18181B] px-3.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
          or continue with
        </span>
      </div>

      {/* Social Oauth Buttons */}
      <SocialButton disabled={isSubmitting}>
        Google Workspaces
      </SocialButton>

      {/* Signup Redirection footer */}
      <p className="text-center text-xs text-zinc-400 mt-2 font-medium">
        Don't have an account?{' '}
        <Link
          to="/signup"
          className="text-blue-500 hover:text-blue-400 font-bold hover:underline focus:outline-none"
        >
          Sign Up
        </Link>
      </p>

    </form>
  )
}
