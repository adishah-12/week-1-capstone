import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Header.css'

function Header() {
  const { isAuthenticated } = useAuth()

  return (
    <header className="header">
      <Link to="/" className="header__logo">🥄 poonful</Link>
      <Link
        to={isAuthenticated ? '/profile' : '/login'}
        className="header__account"
        aria-label={isAuthenticated ? 'Your profile' : 'Log in'}
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" />
        </svg>
      </Link>
    </header>
  )
}

export default Header