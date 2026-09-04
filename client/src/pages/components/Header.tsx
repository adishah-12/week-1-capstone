import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Logo from './Logo'
import './Header.css'

function Header() {
  const { isAuthenticated } = useAuth()

  return (
    <header className="header">
      <Logo />

      {isAuthenticated ? (
        <Link to="/profile" className="header__account" aria-label='Your profile'>
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" />
          </svg>
        </Link>
      ) : (
        <Link to="/login" className="header__login-link">
          Log In
        </Link>
      )}
    </header>
  )
}

export default Header