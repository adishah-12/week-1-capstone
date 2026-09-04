import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import Profile from '../../src/pages/Profile'
import { useAuth } from '../../src/context/AuthContext'

vi.mock('../../src/context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

function mockAuth(overrides = {}) {
  vi.mocked(useAuth).mockReturnValue({
    user: { _id: 'user-1', email: 'gaya@gmail.com', createdAt: '', updatedAt: '' },
    token: 'fake-token',
    isAuthenticated: true,
    login: vi.fn(),
    signup: vi.fn(),
    logout: vi.fn(),
    ...overrides,
  })
}

describe('Profile', () => {
  it('prefills the email field with the current user', () => {
    mockAuth()
    render(<BrowserRouter><Profile /></BrowserRouter>)
    expect(screen.getByDisplayValue('gaya@gmail.com')).toBeInTheDocument()
  })

  it('shows a placeholder toast when Save Changes is clicked', async () => {
    mockAuth()
    const user = userEvent.setup()
    render(<BrowserRouter><Profile /></BrowserRouter>)

    await user.click(screen.getByRole('button', { name: 'Save Changes' }))

    expect(
      await screen.findByText(/not available yet/i)
    ).toBeInTheDocument()
  })

  it('calls logout and navigates on Log Out click', async () => {
    const logout = vi.fn()
    mockAuth({ logout })
    const user = userEvent.setup()
    render(<BrowserRouter><Profile /></BrowserRouter>)

    await user.click(screen.getByRole('button', { name: 'Log Out' }))

    expect(logout).toHaveBeenCalled()
  })

  it('shows a confirm modal before "deleting" the account', async () => {
    mockAuth()
    const user = userEvent.setup()
    render(<BrowserRouter><Profile /></BrowserRouter>)

    await user.click(screen.getByRole('button', { name: 'Delete Account' }))
    expect(screen.getByText('Delete account?')).toBeInTheDocument()

    await user.click(screen.getByText('Yes, Delete Account'))
    expect(
      await screen.findByText(/not available yet/i)
    ).toBeInTheDocument()
  })
})