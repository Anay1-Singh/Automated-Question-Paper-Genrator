import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { KeyRound, ArrowRight, RefreshCw, Mail } from 'lucide-react'
import AuthLayout from '../components/auth/AuthLayout'
import { api } from '../utils/api'

export default function VerifyOTP() {
  const navigate = useNavigate()
  
  // Retrieve email from sessionStorage
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  
  // Timers:
  // - Expiry: 5 minutes (300 seconds)
  // - Resend Cooldown: 60 seconds
  const [expiryTime, setExpiryTime] = useState(300)
  const [resendCooldown, setResendCooldown] = useState(60)
  
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ]

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('signup_email')
    if (!storedEmail) {
      // If no pending email, send them back to signup
      navigate('/signup')
      return
    }
    setEmail(storedEmail)
  }, [navigate])

  // Countdowns
  useEffect(() => {
    if (expiryTime <= 0) return
    const timer = setInterval(() => {
      setExpiryTime((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [expiryTime])

  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [resendCooldown])

  // Format timer into MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Handle digit inputs
  const handleChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError('')

    // Move focus to next input if digit entered
    if (value && index < 5) {
      inputRefs[index + 1].current.focus()
    }
  }

  // Handle backspace/key down navigation
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Focus previous box and clear it
        const newOtp = [...otp]
        newOtp[index - 1] = ''
        setOtp(newOtp)
        inputRefs[index - 1].current.focus()
      } else if (otp[index]) {
        // Clear current box
        const newOtp = [...otp]
        newOtp[index] = ''
        setOtp(newOtp)
      }
    }
  }

  // Handle paste events (e.g. paste 123456)
  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').trim()
    if (!/^\d{6}$/.test(pastedData)) return

    const digits = pastedData.split('')
    setOtp(digits)
    
    // Focus last box
    inputRefs[5].current.focus()
  }

  // Submit OTP Verification
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')
    
    const code = otp.join('')
    if (code.length !== 6) {
      setError('Please enter all 6 digits of the verification code.')
      return
    }

    if (expiryTime <= 0) {
      setError('The verification code has expired. Please click resend to get a new code.')
      return
    }

    setIsSubmitting(true)
    try {
      const data = await api.post('/auth/verify-otp', {
        email,
        otp: code
      })
      // Clear temporary email
      sessionStorage.removeItem('signup_email')
      // Save access token, user, and role
      localStorage.setItem('token', data.access_token)
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('role', data.user.role || 'student')
      // Redirect to role-based dashboard
      const role = data.user.role || 'student'
      navigate(role === 'admin' ? '/dashboard/admin' : '/dashboard/student')
    } catch (err) {
      setError(err.message || 'Verification failed. Please check the code and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Resend OTP
  const handleResend = async () => {
    if (resendCooldown > 0) return
    
    setError('')
    setSuccessMessage('')
    setIsSubmitting(true)
    
    try {
      await api.post('/auth/resend-otp', { email })
      setOtp(['', '', '', '', '', ''])
      setSuccessMessage('A new verification code has been sent to your email.')
      setExpiryTime(300) // Reset 5-minute expiry
      setResendCooldown(60) // Reset 60s resend cooldown
      // Focus first input
      inputRefs[0].current.focus()
    } catch (err) {
      setError(err.message || 'Failed to resend verification code. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      headline="Verify your email"
      subtitle="We have sent a 6-digit verification code to your registered email address to secure your account."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full text-left">
        
        {/* Title & Info */}
        <div className="flex flex-col gap-1.5">
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight flex items-center gap-2">
            <KeyRound className="w-6 h-6 text-blue-500" />
            Enter Security Code
          </h2>
          <p className="text-xs text-zinc-400 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-zinc-500" />
            Sent to: <span className="text-zinc-300 font-semibold">{email}</span>
          </p>
        </div>

        {/* Dynamic Alerts */}
        {error && (
          <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 font-semibold font-sans">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="p-3 text-xs bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 font-semibold font-sans">
            {successMessage}
          </div>
        )}

        {/* 6-Digit input boxes */}
        <div className="flex justify-between gap-2.5 my-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              disabled={isSubmitting}
              className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold rounded-xl bg-[#09090B] border border-[#27272A] text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150"
            />
          ))}
        </div>

        {/* Expiry Timer */}
        <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
          <span>Code Expiry:</span>
          {expiryTime > 0 ? (
            <span className="text-blue-500 font-mono font-bold">{formatTime(expiryTime)}</span>
          ) : (
            <span className="text-red-500 font-bold">Code Expired</span>
          )}
        </div>

        {/* Submit Verification button */}
        <button
          type="submit"
          disabled={isSubmitting || otp.includes('')}
          className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/30 disabled:text-zinc-500 text-white text-xs sm:text-sm font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-900/10 hover:shadow-blue-900/25 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed hover:-translate-y-0.5"
        >
          {isSubmitting ? 'Verifying Code...' : 'Verify & Activate Account'}
          {!isSubmitting && <ArrowRight className="w-4 h-4" />}
        </button>

        {/* Resend Cooldown Section */}
        <div className="flex flex-col gap-2.5 items-center mt-2">
          {resendCooldown > 0 ? (
            <p className="text-[11px] text-zinc-500 font-medium">
              Resend verification code in <span className="text-zinc-400 font-mono font-bold">{resendCooldown}s</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-400 font-bold hover:underline transition-colors focus:outline-none disabled:text-zinc-500 disabled:no-underline"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-spin' : ''}`} />
              Resend Verification Code
            </button>
          )}

          <p className="text-center text-xs text-zinc-500 mt-2 font-medium">
            Incorrect email address?{' '}
            <Link
              to="/signup"
              className="text-blue-500 hover:text-blue-400 font-bold hover:underline focus:outline-none"
            >
              Edit Registration Details
            </Link>
          </p>
        </div>

      </form>
    </AuthLayout>
  )
}
