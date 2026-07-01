import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, ArrowRight } from 'lucide-react'
import AuthLayout from '../components/auth/AuthLayout'
import AuthInput from '../components/auth/AuthInput'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) {
      setError('Email address is required')
      return
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)

    // Simulate recovery email API call
    setTimeout(() => {
      console.log('Recovery Email Requested:', { email })
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 800)
  }

  return (
    <AuthLayout
      headline="Reset password"
      subtitle="Recover your access to the PaperMind AI assessment workspace."
    >
      <div className="flex flex-col gap-6 w-full text-left">
        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">Recover Access</h2>
          <p className="text-xs text-zinc-400">
            {isSubmitted
              ? 'Check your inbox for recovery instructions.'
              : 'Enter your verified email and we\'ll send you a password reset link.'}
          </p>
        </div>

        {isSubmitted ? (
          <div className="flex flex-col gap-6">
            <div className="bg-blue-500/10 border border-blue-500/25 p-4 rounded-xl text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
              We've sent a recovery email to <span className="text-white font-semibold">{email}</span>. Click the link inside the email to configure a new password.
            </div>
            
            <button
              onClick={() => setIsSubmitted(false)}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#09090B] border border-[#27272A] hover:bg-[#18181B] text-xs sm:text-sm font-semibold text-white px-4 py-3.5 rounded-xl hover:border-zinc-700 transition-colors"
            >
              Resend email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full" noValidate>
            <AuthInput
              label="Account Email"
              id="recovery-email"
              type="email"
              icon={Mail}
              placeholder="name@university.edu"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (error) setError('')
              }}
              error={error}
              disabled={isSubmitting}
              required
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white text-xs sm:text-sm font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-900/10 hover:shadow-blue-900/25 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed hover:-translate-y-0.5"
            >
              {isSubmitting ? 'Sending link...' : 'Send Recovery Link'}
              {!isSubmitting && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        )}

        {/* Back to Login link */}
        <p className="text-center text-xs text-zinc-400 mt-2 font-medium">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-blue-500 hover:text-blue-400 font-bold hover:underline focus:outline-none"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Sign In
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
