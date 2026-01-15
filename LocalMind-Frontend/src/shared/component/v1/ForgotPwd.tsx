import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import frgtpwdImg from '../../../assets/frgtpwd.avif'

const ForgotPwd: React.FC = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [emailSent, setEmailSent] = useState(false)

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Failed to send reset link. Please try again.')
        setLoading(false)
        return
      }

      // Show success message
      setSuccess(data.message || 'If the email exists, a reset link has been sent.')
      setEmailSent(true)

      // Auto redirect to login after 5 seconds
      setTimeout(() => {
        navigate('/login')
      }, 5000)
    } catch (err) {
      setError('An error occurred. Please check your connection and try again.')
      console.error('Forgot password error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-screen h-screen bg-[#292828] flex flex-col items-center justify-center p-2 sm:p-3 md:p-4">
      <div className="w-full h-full bg-[#181818] rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Section - Image */}
        <div className="bg-gradient-to-br from-gray-700 to-gray-900 p-0 items-center justify-center hidden md:flex overflow-hidden">
          <img src={frgtpwdImg} alt="Forgot Password" className="w-full h-full object-cover" />
        </div>

        {/* Right Section - Form */}
        <div className="bg-[#181818] p-6 sm:p-8 md:p-12 lg:p-16 xl:p-20 flex flex-col justify-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
            {emailSent ? 'Check Your Email' : 'Reset Password'}
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm md:text-base mb-6 md:mb-8">
            {emailSent
              ? 'We sent a password reset link to your email. Click the link to reset your password.'
              : "Enter your email address and we'll send you a link to reset your password"}
          </p>

          {/* Error Message */}
          {error && (
            <div className="p-3 sm:p-4 bg-red-900 bg-opacity-30 border border-red-500 rounded-lg mb-4">
              <p className="text-red-400 text-xs sm:text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-3 sm:p-4 bg-green-900 bg-opacity-30 border border-green-500 rounded-lg mb-4">
              <p className="text-green-400 text-xs sm:text-sm">{success}</p>
            </div>
          )}

          {/* Email Form */}
          {!emailSent ? (
            <form onSubmit={handleEmailSubmit} className="space-y-3 sm:space-y-4 md:space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-200 text-xs sm:text-sm font-semibold mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 bg-[#2a2a2a] border border-gray-600 rounded-lg text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition disabled:opacity-50"
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-400 hover:bg-gray-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold py-2.5 text-sm sm:text-base rounded-lg transition-colors duration-200 mt-6 sm:mt-7 md:mt-8 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-blue-900 bg-opacity-20 border border-blue-500 rounded-lg">
                <p className="text-blue-300 text-xs sm:text-sm">
                  ℹ️ The reset link will expire in 15 minutes. Check your spam folder if you don't
                  see the email.
                </p>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-gray-400 hover:bg-gray-500 text-black font-bold py-2.5 text-sm sm:text-base rounded-lg transition-colors duration-200"
              >
                Back to Login
              </button>
              <button
                onClick={() => {
                  setEmailSent(false)
                  setEmail('')
                  setError('')
                  setSuccess('')
                }}
                className="w-full bg-transparent border border-gray-400 hover:border-gray-300 text-gray-400 hover:text-gray-300 font-bold py-2.5 text-sm sm:text-base rounded-lg transition-colors duration-200"
              >
                Try Another Email
              </button>
            </div>
          )}

          <p className="text-gray-400 text-xs sm:text-sm mt-4 sm:mt-5 md:mt-6 text-center">
            Remember your password?{' '}
            <Link
              to="/login"
              className="text-white hover:text-gray-300 hover:underline transition-all duration-200"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPwd
