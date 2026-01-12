import { useState } from 'react'
import { Link } from 'react-router-dom'
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

  // Extracted styles
  const glowStyles = `
    @keyframes glow {
      0%, 100% { filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5)); }
      50% { filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.8)); }
    }
    .logo-glow {
      animation: glow 3s ease-in-out infinite;
    }
  `

  return (
    <div className="min-h-screen bg-[#292828] flex flex-col items-center justify-center p-3 sm:p-4 md:p-6 pt-14 sm:pt-16 md:pt-20">
      <style>{glowStyles}</style>

      {/* Card Container */}
      <div className="w-full max-w-7xl bg-[#181818] rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Section - Form */}
        <div className="bg-[#181818] p-6 sm:p-8 md:p-12 lg:p-16 xl:p-20 flex flex-col justify-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
            Forgot Password?
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm md:text-base mb-6 md:mb-8">
            Enter your email to reset your password.
          </p>

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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5 relative mb-6">
              <label className="text-gray-200 text-xs sm:text-sm font-semibold">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2.5 bg-[#2a2a2a] border border-gray-600 rounded-lg text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white hover:bg-gray-200 text-black font-bold py-2.5 text-sm sm:text-base rounded-lg transition-colors duration-200 mt-2 flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              )}
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <div className="text-center mt-6">
              <Link
                to="/login"
                className="text-gray-400 hover:text-white hover:underline transition-all duration-200 text-sm"
              >
                &larr; Back to Login
              </Link>
            </div>
          </form>
        </div>

        {/* Right Side - Robot Image */}
        <div className="bg-gradient-to-br from-gray-700 to-gray-900 hidden md:flex items-center justify-center overflow-hidden">
          <img src={robotImage} alt="AI Robot" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  )
}
