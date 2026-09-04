import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import Signup from '../../src/pages/Signup'
import { useAuth } from '../../src/context/AuthContext'

vi.mock('../../src/context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

function mockAuth(signup = vi.fn()) {
  vi.mocked(useAuth).mockReturnValue({
    signup,
    login: vi.fn(),
    logout: vi.fn(),
    user: null,
    token: null,
    isAuthenticated: false,
  })
}

describe('Signup', () => {
  it('shows a validation error for an invalid email and does not call signup', async () => {
    const signup = vi.fn()
    mockAuth(signup)
    const user = userEvent.setup()

    render(<BrowserRouter><Signup /></BrowserRouter>)

    await user.type(screen.getByLabelText('Username'), 'not-an-email')
    await user.type(screen.getByLabelText('Password'), 'longenoughpassword')
    await user.click(screen.getByRole('button', { name: 'Create Account' }))

    expect(await screen.findByText(/valid email address/i)).toBeInTheDocument()
    expect(signup).not.toHaveBeenCalled()
  })

  it('shows a validation error for a short password', async () => {
    mockAuth()
    const user = userEvent.setup()

    render(<BrowserRouter><Signup /></BrowserRouter>)

    await user.type(screen.getByLabelText('Username'), 'gaya@gmail.com')
    await user.type(screen.getByLabelText('Password'), 'short')
    await user.click(screen.getByRole('button', { name: 'Create Account' }))

    expect(await screen.findByText(/at least 8 characters/i)).toBeInTheDocument()
  })

  it('calls signup with valid input', async () => {
    const signup = vi.fn().mockResolvedValue(undefined)
    mockAuth(signup)
    const user = userEvent.setup()

    render(<BrowserRouter><Signup /></BrowserRouter>)

    await user.type(screen.getByLabelText('Username'), 'gaya@gmail.com')
    await user.type(screen.getByLabelText('Password'), 'longenoughpassword')
    await user.click(screen.getByRole('button', { name: 'Create Account' }))

    expect(signup).toHaveBeenCalledWith('gaya@gmail.com', 'longenoughpassword')
  })
})