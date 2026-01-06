import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { z } from 'zod'
import { registerUser } from '../../services/auth.service'
import type { SignUpPayload } from '../../types/auth.types'
import robotImage from '../../assets/signup-hero.jpg'

// Zod validation schema
const signUpSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  role: z.string().optional(),
  email: z.string().email('Please enter a valid email address'),
  birthPlace: z.string().min(1, 'Birth place is required'),
  location: z.string().min(1, 'Location is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[a-z]/, 'Must contain lowercase letter')
    .regex(/[0-9]/, 'Must contain a number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Must contain special character'),
  portfolioUrl: z.string().url('Please enter a valid URL').or(z.literal('')),
  bio: z
    .string()
    .min(5, 'Bio must be at least 5 characters')
    .max(50, 'Bio must be less than 50 characters'),
})

type FormData = z.infer<typeof signUpSchema>

export default function SignUp() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    role: '',
    email: '',
    birthPlace: '',
    location: '',
    password: '',
    portfolioUrl: '',
    bio: '',
  })

  // Extracted styles to match LoginPage pattern
  const glowStyles = `
    @keyframes glow {
      0%, 100% { filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5)); }
      50% { filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.8)); }
    }
    .logo-glow {
      animation: glow 3s ease-in-out infinite;
    }
  `

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
    setApiError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError(null)
    setErrors({})

    const result = signUpSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FormData, string>> = {}
      result.error.issues.forEach(err => {
        const field = err.path[0] as keyof FormData
        fieldErrors[field] = err.message
      })
      setErrors(fieldErrors)
      return
    }

    const payload: SignUpPayload = {
      firstName: formData.firstName,
      email: formData.email,
      password: formData.password,
      birthPlace: formData.birthPlace,
      location: formData.location,
      portfolioUrl: formData.portfolioUrl,
      bio: formData.bio,
      role: 'user',
    }

    setLoading(true)
    try {
      await registerUser(payload)
      navigate('/login', { state: { message: 'Registration successful! Please log in.' } })
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
    <div className="min-h-screen bg-[#292828] flex flex-col items-center justify-center p-3 sm:p-4 md:p-6">
      <style>{glowStyles}</style>

      {/* Card Container */}
      <div className="w-full max-w-7xl bg-[#181818] rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Section - Form */}
        <div className="bg-[#181818] p-6 sm:p-8 md:p-12 lg:p-16 xl:p-20 flex flex-col justify-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
            Create an Account
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm md:text-base mb-6 md:mb-8">
            Join us today! It's quick and easy.
          </p>

          {/* API Error Alert */}
          {apiError && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm mb-6">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Row 1: Full Name & Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-200 text-xs sm:text-sm font-semibold">Full Name</label>
                <input
                  name="firstName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full px-4 py-2.5 bg-[#2a2a2a] border border-gray-600 rounded-lg text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition ${
                    errors.firstName ? 'border-red-500' : ''
                  }`}
                />
                {errors.firstName && (
                  <span className="text-xs text-red-400">{errors.firstName}</span>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-200 text-xs sm:text-sm font-semibold">Role</label>
                <input
                  name="role"
                  type="text"
                  placeholder="e.g., Product Manager"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full px-4 py-2.5 bg-[#2a2a2a] border border-gray-600 rounded-lg text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition ${
                    errors.role ? 'border-red-500' : ''
                  }`}
                />
                {errors.role && <span className="text-xs text-red-400">{errors.role}</span>}
              </div>
            </div>

            {/* Row 2: Email & Birth Place */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-200 text-xs sm:text-sm font-semibold">Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full px-4 py-2.5 bg-[#2a2a2a] border border-gray-600 rounded-lg text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                />
                {errors.email && <span className="text-xs text-red-400">{errors.email}</span>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-200 text-xs sm:text-sm font-semibold">
                  Birth Place
                </label>
                <input
                  name="birthPlace"
                  type="text"
                  placeholder="Enter your birth place"
                  value={formData.birthPlace}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full px-4 py-2.5 bg-[#2a2a2a] border border-gray-600 rounded-lg text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition ${
                    errors.birthPlace ? 'border-red-500' : ''
                  }`}
                />
                {errors.birthPlace && (
                  <span className="text-xs text-red-400">{errors.birthPlace}</span>
                )}
              </div>
            </div>

            {/* Row 3: Location & Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-200 text-xs sm:text-sm font-semibold">Location</label>
                <input
                  name="location"
                  type="text"
                  placeholder="City, Country"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full px-4 py-2.5 bg-[#2a2a2a] border border-gray-600 rounded-lg text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition ${
                    errors.location ? 'border-red-500' : ''
                  }`}
                />
                {errors.location && <span className="text-xs text-red-400">{errors.location}</span>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-200 text-xs sm:text-sm font-semibold">Password</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    className={`w-full px-4 py-2.5 bg-[#2a2a2a] border border-gray-600 rounded-lg text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition ${
                      errors.password ? 'border-red-500' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && <span className="text-xs text-red-400">{errors.password}</span>}
              </div>
            </div>

            {/* Row 4: Portfolio URL */}
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-200 text-xs sm:text-sm font-semibold">
                Portfolio Url
              </label>
              <input
                name="portfolioUrl"
                type="url"
                placeholder="https://yourportfolio.com"
                value={formData.portfolioUrl}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-4 py-2.5 bg-[#2a2a2a] border border-gray-600 rounded-lg text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition ${
                  errors.portfolioUrl ? 'border-red-500' : ''
                }`}
              />
              {errors.portfolioUrl && (
                <span className="text-xs text-red-400">{errors.portfolioUrl}</span>
              )}
            </div>

            {/* Row 5: Bio */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="bio" className="text-gray-200 text-xs sm:text-sm font-semibold">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={2}
                placeholder="Tell us about yourself"
                value={formData.bio}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-4 py-2.5 bg-[#2a2a2a] border border-gray-600 rounded-lg text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition resize-none ${
                  errors.bio ? 'border-red-500' : ''
                }`}
              />
              {errors.bio && <span className="text-xs text-red-400">{errors.bio}</span>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-400 hover:bg-gray-500 text-black font-bold py-2.5 text-sm sm:text-base rounded-lg transition-colors duration-200 mt-6 sm:mt-7 md:mt-8 flex items-center justify-center gap-2"
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
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-gray-400 text-xs sm:text-sm mt-4 sm:mt-5 md:mt-6 text-center">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-white hover:text-gray-300 hover:underline transition-all duration-200"
            >
              Login
            </Link>
          </p>
        </div>

        {/* Right Side - Robot Image */}
        <div className="bg-gradient-to-br from-gray-700 to-gray-900 hidden md:flex items-center justify-center overflow-hidden">
          <img
            src={robotImage}
            alt="AI Robot"
            className="w-full h-full object-cover brightness-110 contrast-110"
          />
        </div>
      </div>
    </div>
  )
}
