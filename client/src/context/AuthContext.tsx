import { createContext, useContext, useReducer, type ReactNode } from 'react'
import { jwtDecode } from 'jwt-decode'
import api from '../api/client'
import type { User } from '../types/user'
import { extractErrorMessage } from '../types/api'

interface AuthState {
  user: User | null
  token: string | null
}

type AuthAction =
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_SUCCESS':
      return { user: action.payload.user, token: action.payload.token }
    case 'LOGOUT':
      return { user: null, token: null }
    default:
      return state
  }
}

interface DecodedToken {
  user: User
}

function init(): AuthState {
  const token = localStorage.getItem('token')
  if (!token) return { user: null, token: null }

  try {
    const decoded = jwtDecode<DecodedToken>(token)
    return { user: decoded.user, token }
  } catch {
    localStorage.removeItem('token')
    return { user: null, token: null }
  }
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, undefined, init)

  function handleAuthSuccess(token: string) {
    localStorage.setItem('token', token)
    const decoded = jwtDecode<DecodedToken>(token)
    dispatch({ type: 'AUTH_SUCCESS', payload: { user: decoded.user, token } })
  }

  async function login(email: string, password: string) {
    try {
      const res = await api.post('/users/login', { email, password })
      handleAuthSuccess(res.data.token)
    } catch (err) {
      throw new Error(extractErrorMessage(err, 'Login failed.'))
    }
  }

  async function signup(email: string, password: string) {
    try {
      const res = await api.post('/users/signup', { email, password })
      handleAuthSuccess(res.data.token)
    } catch (err) {
      throw new Error(extractErrorMessage(err, 'Signup failed.'))
    }
  }

  function logout() {
    localStorage.removeItem('token')
    dispatch({ type: 'LOGOUT' })
  }

  return (
    <AuthContext.Provider
      value={{ ...state, login, signup, logout, isAuthenticated: !!state.token }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}