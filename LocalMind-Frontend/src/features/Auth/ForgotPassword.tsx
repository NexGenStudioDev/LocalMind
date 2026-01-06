import { useState } from 'react'
import { Link } from 'react-router-dom'
import Input from '../../shared/component/v1/Input'
import { forgotPassword } from '../../services/auth.service'
import robotImage from '../../assets/forgot-password-robot.png'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError(null)
    setSuccessMessage(null)

    if (!email) {
      setApiError('Please enter your email address')
      return
    }

    setLoading(true)
    try {
      const response = await forgotPassword(email)
      setSuccessMessage(response.message || 'If an account exists, a reset link has been sent.')
    } catch (error) {
      if (error instanceof Error) {
        setApiError(error.message)
      } else {
        setApiError('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Left Side - Robot Image (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-gradient-to-br from-gray-400 to-gray-600">
        <img src={robotImage} alt="AI Robot" className="w-full h-full object-cover" />
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Forgot Password?</h1>
            <p className="text-gray-400">Enter your email to reset your password.</p>
          </div>

          {/* Feedback Messages */}
          {apiError && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm mb-6">
              {apiError}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg text-sm mb-6">
              {successMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                &larr; Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
