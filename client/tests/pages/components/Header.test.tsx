import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import Header from '../../../src/pages/components/Header'
import { useAuth } from '../../../src/context/AuthContext'

vi.mock('../../../src/context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

describe('Header', () => {
  it('shows a "Log In" text link to /login when logged out', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      user: null,
      token: null,
      login: vi.fn(),
      signup: vi.fn(),
      logout: vi.fn(),
    })

    render(<BrowserRouter><Header /></BrowserRouter>)
    expect(screen.getByText('Log In')).toHaveAttribute('href', '/login')
  })

  it('shows the account icon linking to /profile when logged in', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      user: { _id: '1', email: 'gaya@gmail.com', createdAt: '', updatedAt: '' },
      token: 'fake-token',
      login: vi.fn(),
      signup: vi.fn(),
      logout: vi.fn(),
    })

    render(<BrowserRouter><Header /></BrowserRouter>)
    expect(screen.getByLabelText('Your profile')).toHaveAttribute('href', '/profile')
  })
})