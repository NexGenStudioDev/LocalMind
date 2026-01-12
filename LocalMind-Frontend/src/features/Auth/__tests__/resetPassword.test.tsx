import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ResetPassword from '../ResetPassword'
import * as authService from '../../../services/auth.service'

// Mock the auth service and params
vi.mock('../../../services/auth.service', () => ({
  resetPassword: vi.fn(),
}))

describe('ResetPassword Component', () => {
  it('renders correctly', () => {
    // Render with a token in the path
    render(
      <MemoryRouter initialEntries={['/reset-password/test-token']}>
        <Routes>
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: /Reset Password/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/^New Password$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Confirm Password$/i)).toBeInTheDocument()
  })

  it('validates password mismatch', async () => {
    render(
      <MemoryRouter initialEntries={['/reset-password/test-token']}>
        <Routes>
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText(/^New Password$/i), { target: { value: 'Pass123!@' } })
    fireEvent.change(screen.getByLabelText(/^Confirm Password$/i), {
      target: { value: 'DifferentPass123!' },
    })

    // Select button specifically
    fireEvent.click(screen.getByRole('button', { name: /Reset Password/i }))

    expect(await screen.findByText(/Passwords don't match/i)).toBeInTheDocument()
  })

  it('calls API on valid submission', async () => {
    const mockResetPassword = vi.spyOn(authService, 'resetPassword')
    mockResetPassword.mockResolvedValue({ message: 'Success' })

    render(
      <MemoryRouter initialEntries={['/reset-password/test-token-123']}>
        <Routes>
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText(/^New Password$/i), {
      target: { value: 'NewPass123!@' },
    })
    fireEvent.change(screen.getByLabelText(/^Confirm Password$/i), {
      target: { value: 'NewPass123!@' },
    })

    fireEvent.click(screen.getByRole('button', { name: /Reset Password/i }))

    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith('test-token-123', 'NewPass123!@')
    })

    expect(await screen.findByText(/Password Reset Successful!/i)).toBeInTheDocument()
  })
})
