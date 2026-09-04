import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import Login from '../../src/pages/Login'
import { useAuth } from '../../src/context/AuthContext'

vi.mock('../context/AuthContext')

describe('Login', () => {
  it('calls login and navigates on success', async () => {
    const mockLogin = vi.fn().mockResolvedValue(undefined)
    vi.mocked(useAuth).mockReturnValue({
      login: mockLogin,
      signup: vi.fn(),
      logout: vi.fn(),
      user: null,
      token: null,
      isAuthenticated: false,
    })

    const user = userEvent.setup()
    render(<BrowserRouter><Login /></BrowserRouter>)

    await user.type(screen.getByLabelText('Email'), 'gaya@gmail.com')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Login' }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('gaya@gmail.com', 'password123')
    })
  })

  it('shows an error message on failed login', async () => {
    vi.mocked(useAuth).mockReturnValue({
      login: vi.fn().mockRejectedValue(new Error('bad credentials')),
      signup: vi.fn(),
      logout: vi.fn(),
      user: null,
      token: null,
      isAuthenticated: false,
    })

    const user = userEvent.setup()
    render(<BrowserRouter><Login /></BrowserRouter>)

    await user.type(screen.getByLabelText('Email'), 'wrong@gmail.com')
    await user.type(screen.getByLabelText('Password'), 'wrongpass')
    await user.click(screen.getByRole('button', { name: 'Login' }))

    expect(await screen.findByText('bad credentials')).toBeInTheDocument()
  })
})