import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import ForgotPassword from '../ForgotPassword'
import * as authService from '../../../services/auth.service'

// Mock the auth service
vi.mock('../../../services/auth.service', () => ({
  forgotPassword: vi.fn(),
}))

describe('ForgotPassword Component', () => {
  it('renders correctly', () => {
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: /Forgot Password/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Enter your email/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Send Reset Link/i })).toBeInTheDocument()
  })

  it('validates empty email', async () => {
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: /Send Reset Link/i }))

    expect(await screen.findByText(/Please enter your email address/i)).toBeInTheDocument()
  })

  it('calls API on valid submission', async () => {
    const mockForgotPassword = vi.spyOn(authService, 'forgotPassword')
    mockForgotPassword.mockResolvedValue({ message: 'Reset link sent' })

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Send Reset Link/i }))

    await waitFor(() => {
      expect(mockForgotPassword).toHaveBeenCalledWith('test@example.com')
    })

    expect(await screen.findByText(/If an account exists/i)).toBeInTheDocument()
  })

  it('handles API errors', async () => {
    const mockForgotPassword = vi.spyOn(authService, 'forgotPassword')
    mockForgotPassword.mockRejectedValue(new Error('Network error'))

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Send Reset Link/i }))

    expect(await screen.findByText(/Network error/i)).toBeInTheDocument()
  })
})
