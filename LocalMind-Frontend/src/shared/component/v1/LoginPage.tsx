import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import robotImg from '../../../assets/login.png'
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import robotImg from '../../../assets/robot.png'
import aiImg from '../../../assets/Artificial intelligence.png'
import apiService from '../../../core/api.service'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const glowStyles = `
    @keyframes glow {
      0%, 100% { filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5)); }
      50% { filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.8)); }
    }
    .logo-glow {
      animation: glow 3s ease-in-out infinite;
    }
  `
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await fetch('/api/v1/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Login failed. Please try again.')
        setLoading(false)
        return
      }

      // Store token in localStorage
      if (data.data?.token) {
        localStorage.setItem('token', data.data.token)
        localStorage.setItem('user', JSON.stringify(data.data.user || {}))

        // Store remember me preference
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true')
          localStorage.setItem('savedEmail', email)
        }

        setSuccess('Login successful! Redirecting...')

        // Redirect after brief delay
        setTimeout(() => {
          navigate('/dashboard')
        }, 1000)
      }
    } catch (err) {
      setError('An error occurred. Please check your connection and try again.')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }
    setIsLoading(true)

      const handleLogin = async () => {
        try {
          const response = await apiService.login(email, password)

      if (!response.success) {
        throw new Error(response.message || 'Login failed. Please try again.')
      }

      setSuccess('Login successful! Redirecting...')

      // Store token if provided
      if (response.data?.token) {
        localStorage.setItem('authToken', response.data.token)
      }

      // Store user info if remember me is checked
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email)
      } else {
        localStorage.removeItem('rememberedEmail')
      }

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard')
      }, 1000)
    } catch (err: any) {
      setError(err.message || 'An error occurred during login. Please try again.')
      console.error('Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Load remembered email on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail')
    if (rememberedEmail) {
      setEmail(rememberedEmail)
      setRememberMe(true)
    }
  }, [])
        <img
          src={aiImg}
          alt="Artificial Intelligence Logo"
          className="logo-glow w-20 sm:w-24 h-20 sm:h-24 object-cover rounded-full shadow-2xl"
        />
      </div>

      <div className="w-full max-w-7xl bg-[#181818] rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Section */}
        <div className="bg-[#181818] p-6 sm:p-8 md:p-12 lg:p-16 xl:p-20 flex flex-col justify-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm md:text-base mb-6 md:mb-8">
            Sign in to your account to continue
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6"
          >
            {/* Error Message */}
            {error && (
              <div className="p-3 sm:p-4 bg-red-900 bg-opacity-30 border border-red-500 rounded-lg">
                <p className="text-red-400 text-xs sm:text-sm">{error}</p>
              <div className="p-3 bg-red-900 border border-red-700 rounded-lg text-red-100 text-xs sm:text-sm">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-3 sm:p-4 bg-green-900 bg-opacity-30 border border-green-500 rounded-lg">
                <p className="text-green-400 text-xs sm:text-sm">{success}</p>
              <div className="p-3 bg-green-900 border border-green-700 rounded-lg text-green-100 text-xs sm:text-sm">
                {success}
              </div>
            )}

            {/* Email Input */}
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
                className="w-full px-4 py-2.5 bg-[#2a2a2a] border border-gray-600 rounded-lg text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition disabled:opacity-50"
                required
                disabled={loading}
                disabled={isLoading}
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-gray-200 text-xs sm:text-sm font-semibold mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-[#2a2a2a] border border-gray-600 rounded-lg text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition disabled:opacity-50"
                required
                disabled={loading}
                disabled={isLoading}
              />

              {/* Remember Me & Forgot Password */}
              <div className="flex flex-row items-center justify-between gap-2 mt-2 sm:mt-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="w-4 h-4 bg-gray-700 border border-gray-600 rounded cursor-pointer accent-gray-500 disabled:opacity-50"
                    disabled={loading}
                    className="w-4 h-4 bg-gray-700 border border-gray-600 rounded cursor-pointer accent-gray-500"
                    disabled={isLoading}
                  />
                  <span className="text-gray-300 text-xs sm:text-sm">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-gray-300 hover:text-white hover:underline text-xs sm:text-sm transition-all duration-200"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-400 hover:bg-gray-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold py-2.5 text-sm sm:text-base rounded-lg transition-colors duration-200 mt-6 sm:mt-7 md:mt-8 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  Logging in...
                </>
              ) : (
                'Log In'
              )}
              disabled={isLoading}
              className={`w-full font-bold py-2.5 text-sm sm:text-base rounded-lg transition-colors duration-200 mt-6 sm:mt-7 md:mt-8 ${
                isLoading
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  : 'bg-gray-400 hover:bg-gray-500 text-black'
              }`}
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <p className="text-gray-400 text-xs sm:text-sm mt-4 sm:mt-5 md:mt-6 text-center">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-white hover:text-gray-300 hover:underline transition-all duration-200"
            >
              Create Account
            </Link>
          </p>
        </div>

        {/* Right Section */}
        <div className="bg-gradient-to-br from-gray-700 to-gray-900 p-0 items-center justify-center hidden md:flex overflow-hidden">
          <img src={robotImg} alt="Robot" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  )
}

export default LoginPage
