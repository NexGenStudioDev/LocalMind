import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import frgtpwdImg from '../../../assets/frgtpwd.avif'

const ResetPassword: React.FC = () => {
  const navigate = useNavigate()
  const { token } = useParams<{ token: string }>()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false,
  })
  const [passwordsMatch, setPasswordsMatch] = useState(true)

  // Validate password requirements in real-time
  useEffect(() => {
    const validatePassword = (pwd: string) => {
      setPasswordRequirements({
        minLength: pwd.length >= 8,
        hasUppercase: /[A-Z]/.test(pwd),
        hasLowercase: /[a-z]/.test(pwd),
        hasNumber: /[0-9]/.test(pwd),
        hasSpecial: /[@$!%*?&]/.test(pwd),
      })
    }
    validatePassword(password)
  }, [password])

  // Check if passwords match
  useEffect(() => {
    if (confirmPassword) {
      setPasswordsMatch(password === confirmPassword)
    }
  }, [password, confirmPassword])

  const isPasswordValid = Object.values(passwordRequirements).every(req => req)
  const canSubmit = isPasswordValid && passwordsMatch && !loading

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      setError('Invalid reset link. Please request a new password reset.')
      return
    }

    if (!isPasswordValid) {
      setError('Password does not meet all requirements.')
      return
    }

    if (!passwordsMatch) {
      setError('Passwords do not match.')
      return
    }

    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await fetch(`/api/v1/auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Failed to reset password. The link may have expired.')
        setLoading(false)
        return
      }

      setSuccess('Password reset successful! Redirecting to login...')

      // Redirect to login after brief delay
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError('An error occurred. Please check your connection and try again.')
      console.error('Reset password error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-screen h-screen bg-[#292828] flex flex-col items-center justify-center p-2 sm:p-3 md:p-4">
      <div className="w-full h-full bg-[#181818] rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Section - Image */}
        <div className="bg-gradient-to-br from-gray-700 to-gray-900 p-0 items-center justify-center hidden md:flex overflow-hidden">
          <img src={frgtpwdImg} alt="Reset Password" className="w-full h-full object-cover" />
        </div>

        {/* Right Section - Form */}
        <div className="bg-[#181818] p-6 sm:p-8 md:p-12 lg:p-16 xl:p-20 flex flex-col justify-center overflow-y-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
            Create New Password
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm md:text-base mb-6 md:mb-8">
            Enter a strong password to reset your account
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

          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-5">
              {/* Password Input */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-gray-200 text-xs sm:text-sm font-semibold mb-2"
                >
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-[#2a2a2a] border border-gray-600 rounded-lg text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition disabled:opacity-50"
                  disabled={loading}
                />
              </div>

              {/* Password Requirements Checklist */}
              <div className="text-xs sm:text-sm space-y-1">
                <p className="text-gray-400 font-semibold mb-2">Password Requirements:</p>
                <div className="space-y-1">
                  {[
                    { key: 'minLength', label: '8+ characters' },
                    { key: 'hasUppercase', label: 'At least 1 uppercase letter (A-Z)' },
                    { key: 'hasLowercase', label: 'At least 1 lowercase letter (a-z)' },
                    { key: 'hasNumber', label: 'At least 1 number (0-9)' },
                    { key: 'hasSpecial', label: 'At least 1 special character (@$!%*?&)' },
                  ].map(req => (
                    <div key={req.key} className="flex items-center gap-2">
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center text-xs ${
                          passwordRequirements[req.key as keyof typeof passwordRequirements]
                            ? 'bg-green-500 border-green-500'
                            : 'bg-transparent border-gray-500'
                        }`}
                      >
                        {passwordRequirements[req.key as keyof typeof passwordRequirements] && '✓'}
                      </span>
                      <span
                        className={
                          passwordRequirements[req.key as keyof typeof passwordRequirements]
                            ? 'text-green-400'
                            : 'text-gray-400'
                        }
                      >
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confirm Password Input */}
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
                  className={`w-full px-4 py-2.5 bg-[#2a2a2a] border rounded-lg text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition disabled:opacity-50 ${
                    confirmPassword && !passwordsMatch
                      ? 'border-red-500 focus:ring-red-400'
                      : 'border-gray-600 focus:ring-gray-400'
                  }`}
                  disabled={loading}
                />
                {confirmPassword && !passwordsMatch && (
                  <p className="text-red-400 text-xs sm:text-sm mt-1">Passwords do not match</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full bg-gray-400 hover:bg-gray-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold py-2.5 text-sm sm:text-base rounded-lg transition-colors duration-200 mt-6 sm:mt-7 md:mt-8 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                    Resetting...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-gray-400 hover:bg-gray-500 text-black font-bold py-2.5 text-sm sm:text-base rounded-lg transition-colors duration-200 mt-6 sm:mt-7 md:mt-8"
            >
              Go to Login
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
