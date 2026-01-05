import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { z } from 'zod'
import Input from '../../shared/component/v1/Input'
import { registerUser } from '../../services/auth.service'
import type { SignUpPayload } from '../../types/auth.types'
import robotImage from '../../assets/robot-signup.png'

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
    .regex(/[@$!%*?&]/, 'Must contain special character'),
  portfolioUrl: z.string().url('Please enter a valid URL').or(z.literal('')),
  bio: z.string().max(50, 'Bio must be less than 50 characters'),
})

type FormData = z.infer<typeof signUpSchema>

export default function SignUp() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
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
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Left Side - Robot Image */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-gradient-to-br from-gray-400 to-gray-600">
        <img src={robotImage} alt="AI Robot" className="w-full h-full object-cover" />
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create an Account</h1>
            <p className="text-gray-400">Join us today! It's quick and easy.</p>
          </div>

          {/* API Error Alert */}
          {apiError && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm mb-6">
              {apiError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Row 1: Full Name & Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                name="firstName"
                type="text"
                placeholder="Enter your full name"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                disabled={loading}
              />
              <Input
                label="Role"
                name="role"
                type="text"
                placeholder="e.g., Product Manager"
                value={formData.role}
                onChange={handleChange}
                error={errors.role}
                disabled={loading}
              />
            </div>

            {/* Row 2: Email & Birth Place */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="driver@gmail.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                disabled={loading}
              />
              <Input
                label="Birth Place"
                name="birthPlace"
                type="text"
                placeholder="Enter your birth place"
                value={formData.birthPlace}
                onChange={handleChange}
                error={errors.birthPlace}
                disabled={loading}
              />
            </div>

            {/* Row 3: Location & Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Location"
                name="location"
                type="text"
                placeholder="City, Country"
                value={formData.location}
                onChange={handleChange}
                error={errors.location}
                disabled={loading}
              />
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••••••••••"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                disabled={loading}
              />
            </div>

            {/* Row 4: Portfolio URL */}
            <Input
              label="Portfolio Url"
              name="portfolioUrl"
              type="url"
              placeholder="https://yourportfolio.com"
              value={formData.portfolioUrl}
              onChange={handleChange}
              error={errors.portfolioUrl}
              disabled={loading}
            />

            {/* Row 5: Bio */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="bio" className="text-sm font-medium text-gray-300">
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
                className={`
                  w-full px-4 py-2.5 rounded-lg
                  bg-[#1a1a1a] border border-gray-800
                  text-white placeholder-gray-500
                  focus:outline-none focus:ring-1 focus:ring-gray-600 focus:border-gray-600
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200 resize-none
                  ${errors.bio ? 'border-red-500 focus:ring-red-500' : ''}
                `}
              />
              {errors.bio && <span className="text-xs text-red-400">{errors.bio}</span>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

            {/* Login Link */}
            <p className="text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-white underline hover:text-gray-300 transition-colors"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
