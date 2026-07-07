import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, ArrowRight, FlaskConical, ShieldCheck, GraduationCap } from 'lucide-react'
import AuthInput from './AuthInput'
import PasswordInput from './PasswordInput'
import SocialButton from './SocialButton'
import { api } from '../../utils/api'

const isDev = import.meta.env.MODE === 'development'

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
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('role', data.user.role || 'student')

      const role = data.user.role || 'student'
      navigate(role === 'admin' ? '/dashboard/admin' : '/dashboard/student')
    } catch (err) {
      setFormError(err.message || 'Invalid credentials or connection error.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDevLogin = (role) => {
    const mockUser = {
      id: `dev-${role}-id`,
      name: role === 'admin' ? 'Dev Admin' : 'Dev Student',
      email: `${role}@dev.local`,
      role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    localStorage.setItem('token', `dev-${role}-token`)
    localStorage.setItem('user', JSON.stringify(mockUser))
    localStorage.setItem('role', role)
    navigate(role === 'admin' ? '/dashboard/admin' : '/dashboard/student')
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

      {/* Dev Quick Login (visible only in development) */}
      {isDev && (
        <div className="flex flex-col gap-2.5 p-3 rounded-xl border border-amber-500/20 bg-amber-500/5">
          <div className="flex items-center gap-2 text-[10px] font-bold text-amber-400 uppercase tracking-widest">
            <FlaskConical className="w-3.5 h-3.5" />
            Dev Quick Login
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDevLogin('admin')}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-[11px] font-bold bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/25 transition-all duration-200"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Login as Admin
            </button>
            <button
              type="button"
              onClick={() => handleDevLogin('student')}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-[11px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition-all duration-200"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Login as Student
            </button>
          </div>
        </div>
      )}

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
