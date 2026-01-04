import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import robotImg from '../../../assets/robot.png'

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log('Login submitted for email:', email)
  }

  return (
    <div className="min-h-screen bg-[#292828] flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-7xl bg-[#181818] rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Section */}
        <div className="bg-[#181818] p-6 sm:p-8 md:p-12 lg:p-16 xl:p-20 flex flex-col justify-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mb-6 md:mb-8">
            Sign in to your account to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-gray-300 text-xs sm:text-sm font-medium mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 sm:px-4 py-2 sm:py-2 bg-[#181818] border border-gray-600 rounded-lg text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-gray-300 text-xs sm:text-sm font-medium mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 sm:px-4 py-2 sm:py-2 bg-[#181818] border border-gray-600 rounded-lg text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition"
                required
              />

              {/* Remember Me & Forgot Password */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mt-2 sm:mt-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="w-4 h-4 bg-gray-700 border border-gray-600 rounded cursor-pointer accent-gray-500"
                  />
                  <span className="text-gray-300 text-xs sm:text-sm">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-white hover:text-gray-500 hover:underline text-xs sm:text-sm transition-all duration-200"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gray-500 hover:bg-gray-700 text-black font-medium py-2 sm:py-2.5 text-sm sm:text-base rounded-lg transition-colors duration-200 mt-2 sm:mt-3 md:mt-4"
            >
              Log In
            </button>
          </form>

          <p className="text-gray-400 text-xs sm:text-sm mt-4 sm:mt-5 md:mt-6 text-center">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-white hover:text-white hover:underline transition-all duration-200"
            >
              Create Account
            </Link>
          </p>
        </div>

        {/* Right Section */}
        <div className="bg-gradient-to-br from-gray-700 to-gray-900 p-0 flex items-center justify-center hidden md:flex overflow-hidden">
          <img src={robotImg} alt="Robot" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  )
}

export default LoginPage
