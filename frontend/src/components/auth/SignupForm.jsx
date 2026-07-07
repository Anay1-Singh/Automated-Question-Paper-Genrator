import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, User, ArrowRight, GraduationCap, ShieldCheck } from 'lucide-react'
import AuthInput from './AuthInput'
import PasswordInput from './PasswordInput'
import SocialButton from './SocialButton'
import { api } from '../../utils/api'

export default function SignupForm() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('student')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    // Name Validation
    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required'
    } else if (fullName.trim().length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters'
    }

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

    // Confirm Password Validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirmation is required'
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    // Terms check
    if (!termsAccepted) {
      newErrors.terms = 'You must accept the terms of service'
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
      await api.post('/auth/send-otp', {
        name: fullName,
        email,
        password,
        role
      })
      sessionStorage.setItem('signup_email', email)
      navigate('/verify-otp')
    } catch (err) {
      setFormError(err.message || 'Failed to create account. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full text-left" noValidate>
      
      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">Create your account</h2>
        <p className="text-xs text-zinc-400">Get started by entering your basic information.</p>
      </div>

      {formError && (
        <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 font-semibold">
          {formError}
        </div>
      )}

      <div className="flex flex-col gap-4">
        {/* Full Name Input */}
        <AuthInput
          label="Full Name"
          id="signup-name"
          icon={User}
          placeholder="Professor Alexander"
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value)
            if (errors.fullName) setErrors({ ...errors, fullName: null })
          }}
          error={errors.fullName}
          disabled={isSubmitting}
          required
        />

        {/* Role Selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-300">I am a</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRole('student')}
              disabled={isSubmitting}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold border transition-all duration-200 ${
                role === 'student'
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-900/10'
                  : 'bg-[#09090B] border-[#27272A] text-zinc-400 hover:border-zinc-600 hover:text-zinc-300'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              disabled={isSubmitting}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold border transition-all duration-200 ${
                role === 'admin'
                  ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-400 shadow-lg shadow-indigo-900/10'
                  : 'bg-[#09090B] border-[#27272A] text-zinc-400 hover:border-zinc-600 hover:text-zinc-300'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin (Teacher)
            </button>
          </div>
        </div>

        {/* Email Input */}
        <AuthInput
          label="Email Address"
          id="signup-email"
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
        <PasswordInput
          label="Password"
          id="signup-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            if (errors.password) setErrors({ ...errors, password: null })
            if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null })
          }}
          error={errors.password}
          disabled={isSubmitting}
          required
        />

        {/* Confirm Password Input */}
        <PasswordInput
          label="Confirm Password"
          id="signup-confirm-password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value)
            if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null })
          }}
          error={errors.confirmPassword}
          disabled={isSubmitting}
          required
        />
      </div>

      {/* Terms Checkbox */}
      <div className="flex flex-col gap-1">
        <label className="flex items-start gap-2.5 text-xs text-zinc-400 hover:text-white cursor-pointer select-none font-medium leading-normal">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => {
              setTermsAccepted(e.target.checked)
              if (errors.terms) setErrors({ ...errors, terms: null })
            }}
            disabled={isSubmitting}
            className="w-4 h-4 rounded bg-[#09090B] border border-[#27272A] text-blue-600 focus:ring-blue-500 focus:ring-offset-[#18181B] accent-blue-600 shrink-0 mt-0.5"
          />
          <span>
            I agree to the{' '}
            <Link to="/terms" className="text-blue-500 hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-blue-500 hover:underline">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {errors.terms && (
          <span className="text-[10px] font-semibold text-red-400 mt-1 block font-mono">
            {errors.terms}
          </span>
        )}
      </div>

      {/* Submit Action Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white text-xs sm:text-sm font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-900/10 hover:shadow-blue-900/25 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed hover:-translate-y-0.5"
      >
        {isSubmitting ? 'Creating Account...' : 'Get Started'}
        {!isSubmitting && <ArrowRight className="w-4 h-4" />}
      </button>

      {/* Divider */}
      <div className="relative flex items-center justify-center my-1">
        <div className="absolute inset-x-0 h-px bg-[#27272A]/70" />
        <span className="relative bg-[#18181B] px-3.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
          or continue with
        </span>
      </div>

      {/* Social OAuth Buttons */}
      <SocialButton disabled={isSubmitting}>
        Google Workspaces
      </SocialButton>

      {/* Login Redirection footer */}
      <p className="text-center text-xs text-zinc-400 mt-2 font-medium">
        Already have an account?{' '}
        <Link
          to="/login"
          className="text-blue-500 hover:text-blue-400 font-bold hover:underline focus:outline-none"
        >
          Sign In
        </Link>
      </p>

    </form>
  )
}
