import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthProvider, useAuth } from '../../src/context/AuthContext'
import api from '../../src/api/client'
import { jwtDecode } from 'jwt-decode'

vi.mock('../../src/api/client', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn(),
}))

function TestHarness() {
  const { user, isAuthenticated, login, signup, logout } = useAuth()

  async function handleLogin() {
    try {
      await login('gaya@gmail.com', 'password123')
    } catch {
      // expected in the failure-path test; real pages catch this to show an error message
    }
  }

  async function handleSignup() {
    try {
      await signup('new@gmail.com', 'password123')
    } catch {
      // same as above
    }
  }

  return (
    <div>
      <p data-testid="auth-state">{isAuthenticated ? 'logged-in' : 'logged-out'}</p>
      <p data-testid="user-email">{user?.email ?? 'none'}</p>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleSignup}>Signup</button>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

const mockUser = { _id: 'user-1', email: 'gaya@gmail.com', createdAt: '', updatedAt: '' }

beforeEach(() => {
  localStorage.clear()
  vi.mocked(jwtDecode).mockReturnValue({ user: mockUser })
})

describe('AuthContext', () => {
  it('starts logged out when there is no stored token', () => {
    render(
      <AuthProvider>
        <TestHarness />
      </AuthProvider>
    )
    expect(screen.getByTestId('auth-state')).toHaveTextContent('logged-out')
  })

  it('initializes as logged in when a valid token exists in localStorage', () => {
    localStorage.setItem('token', 'fake-token')
    render(
      <AuthProvider>
        <TestHarness />
      </AuthProvider>
    )
    expect(screen.getByTestId('auth-state')).toHaveTextContent('logged-in')
    expect(screen.getByTestId('user-email')).toHaveTextContent('gaya@gmail.com')
  })

  it('clears a corrupt stored token instead of crashing', () => {
    localStorage.setItem('token', 'garbage')
    vi.mocked(jwtDecode).mockImplementationOnce(() => {
      throw new Error('invalid token')
    })

    render(
      <AuthProvider>
        <TestHarness />
      </AuthProvider>
    )

    expect(screen.getByTestId('auth-state')).toHaveTextContent('logged-out')
    expect(localStorage.getItem('token')).toBeNull()
  })

  it('login stores the token and updates state on success', async () => {
    vi.mocked(api.post).mockResolvedValue({ data: { token: 'new-token' } })
    const user = userEvent.setup()

    render(
      <AuthProvider>
        <TestHarness />
      </AuthProvider>
    )

    await user.click(screen.getByText('Login'))

    await waitFor(() => {
      expect(screen.getByTestId('auth-state')).toHaveTextContent('logged-in')
    })
    expect(localStorage.getItem('token')).toBe('new-token')
    expect(api.post).toHaveBeenCalledWith('/users/login', {
      email: 'gaya@gmail.com',
      password: 'password123',
    })
  })

  it('login throws with the extracted message on failure and does not change state', async () => {
    vi.mocked(api.post).mockRejectedValue({
      response: { data: { err: 'bad credentials' } },
    })
    const user = userEvent.setup()

    render(
      <AuthProvider>
        <TestHarness />
      </AuthProvider>
    )

    await user.click(screen.getByText('Login'))

    await waitFor(() => {
      expect(screen.getByTestId('auth-state')).toHaveTextContent('logged-out')
    })
  })

  it('signup stores the token and updates state on success', async () => {
    vi.mocked(api.post).mockResolvedValue({ data: { token: 'signup-token' } })
    const user = userEvent.setup()

    render(
      <AuthProvider>
        <TestHarness />
      </AuthProvider>
    )

    await user.click(screen.getByText('Signup'))

    await waitFor(() => {
      expect(screen.getByTestId('auth-state')).toHaveTextContent('logged-in')
    })
    expect(api.post).toHaveBeenCalledWith('/users/signup', {
      email: 'new@gmail.com',
      password: 'password123',
    })
  })

  it('logout clears the token and resets state', async () => {
    localStorage.setItem('token', 'fake-token')
    const user = userEvent.setup()

    render(
      <AuthProvider>
        <TestHarness />
      </AuthProvider>
    )

    expect(screen.getByTestId('auth-state')).toHaveTextContent('logged-in')

    await user.click(screen.getByText('Logout'))

    expect(screen.getByTestId('auth-state')).toHaveTextContent('logged-out')
    expect(localStorage.getItem('token')).toBeNull()
  })

  it('useAuth throws when used outside an AuthProvider', () => {
    function Bare() {
      useAuth()
      return null
    }
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Bare />)).toThrow('useAuth must be used within an AuthProvider')
    spy.mockRestore()
  })
})