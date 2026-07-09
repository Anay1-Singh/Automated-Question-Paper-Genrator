import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react'
import AuthLayout from '../components/auth/AuthLayout'
import AuthInput from '../components/auth/AuthInput'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) {
      setError('Email address is required')
      return
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    setError('Password recovery is not enabled yet. Please contact your platform administrator.')
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
            Enter your verified email to check whether recovery is available for your account.
          </p>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-100">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
          <p>Password reset emails require a configured recovery endpoint and mail template. This page will not send unconfigured emails.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full" noValidate>
          <AuthInput
            label="Account Email"
            id="recovery-email"
            type="email"
            icon={Mail}
            placeholder="Email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (error) setError('')
            }}
            error={error}
            required
          />

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-900/10 hover:shadow-blue-900/25 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500 hover:-translate-y-0.5"
          >
            Check Recovery Availability
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

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
