import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import frgtpwdImg from '../../../assets/frgtpwd.avif'

const ForgotPwd: React.FC = () => {
  const [email, setEmail] = useState('')
  const [step, setStep] = useState<'email' | 'verification' | 'reset'>('email')
  const [verificationCode, setVerificationCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle email submission
    console.log('Email submitted:', email)
    setStep('verification')
  }

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle verification code
    console.log('Verification code:', verificationCode)
    setStep('reset')
  }

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle password reset
    console.log('Password reset for:', email)
    // Redirect to login after successful reset
  }

  return (
    <div className="w-screen h-screen bg-[#292828] flex flex-col items-center justify-center p-2 sm:p-3 md:p-4">
      <div className="w-full h-full bg-[#181818] rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Section - Image */}
        <div className="bg-gradient-to-br from-gray-700 to-gray-900 p-0 flex items-center justify-center hidden md:flex overflow-hidden">
          <img src={frgtpwdImg} alt="Forgot Password" className="w-full h-full object-cover" />
        </div>

        {/* Right Section - Form */}
        <div className="bg-[#181818] p-6 sm:p-8 md:p-12 lg:p-16 xl:p-20 flex flex-col justify-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
            Reset Password
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm md:text-base mb-6 md:mb-8">
            {step === 'email' &&
              "Enter your email address and we'll send you a link to reset your password"}
            {step === 'verification' && 'Enter the verification code sent to your email'}
            {step === 'reset' && 'Create a new password for your account'}
          </p>

          {/* Email Step */}
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-3 sm:space-y-4 md:space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-200 text-xs sm:text-sm font-semibold mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 bg-[#2a2a2a] border border-gray-600 rounded-lg text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gray-400 hover:bg-gray-500 text-black font-bold py-2.5 text-sm sm:text-base rounded-lg transition-colors duration-200 mt-6 sm:mt-7 md:mt-8"
              >
                Send Reset Link
              </button>
            </form>
          )}

          {/* Verification Step */}
          {step === 'verification' && (
            <form
              onSubmit={handleVerificationSubmit}
              className="space-y-3 sm:space-y-4 md:space-y-5"
            >
              <div>
                <label
                  htmlFor="verification"
                  className="block text-gray-200 text-xs sm:text-sm font-semibold mb-2"
                >
                  Verification Code
                </label>
                <input
                  id="verification"
                  type="text"
                  value={verificationCode}
                  onChange={e => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full px-4 py-2.5 bg-[#2a2a2a] border border-gray-600 rounded-lg text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                  required
                />
              </div>

              <p className="text-gray-400 text-xs sm:text-sm">
                Didn't receive the code?{' '}
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="text-gray-300 hover:text-white hover:underline transition-all duration-200"
                >
                  Resend
                </button>
              </p>

              <button
                type="submit"
                className="w-full bg-gray-400 hover:bg-gray-500 text-black font-bold py-2.5 text-sm sm:text-base rounded-lg transition-colors duration-200 mt-6 sm:mt-7 md:mt-8"
              >
                Verify Code
              </button>
            </form>
          )}

          {/* Reset Password Step */}
          {step === 'reset' && (
            <form onSubmit={handleResetSubmit} className="space-y-3 sm:space-y-4 md:space-y-5">
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-gray-200 text-xs sm:text-sm font-semibold mb-2"
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-[#2a2a2a] border border-gray-600 rounded-lg text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-gray-200 text-xs sm:text-sm font-semibold mb-2"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-[#2a2a2a] border border-gray-600 rounded-lg text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gray-400 hover:bg-gray-500 text-black font-bold py-2.5 text-sm sm:text-base rounded-lg transition-colors duration-200 mt-6 sm:mt-7 md:mt-8"
              >
                Reset Password
              </button>
            </form>
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
