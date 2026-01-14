import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface ApiService {
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; data?: unknown; error?: string }>
}

interface LoginPageProps {
  apiService: ApiService
}

const LoginPage: React.FC<LoginPageProps> = ({ apiService }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      setError('')
      const response = await apiService.login(email, password)

      if (response.success) {
        navigate('/dashboard')
      } else {
        setError(response.error || 'Login failed')
      }
    } catch (err) {
      setError('An error occurred during login')
      console.error(err)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleLogin()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-800 p-8 rounded-lg border border-zinc-500/50"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Login</h2>

        {error && <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4">{error}</div>}

        <div className="mb-4">
          <label className="block text-white mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-white mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  )
}

export default LoginPage
