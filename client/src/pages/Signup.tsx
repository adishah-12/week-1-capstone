import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import MinimalHeader from './components/MinimalHeader'
import './Signup.css'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const { signup } = useAuth()
  const navigate = useNavigate()

  function validate(): boolean {
    let valid = true

    if (!EMAIL_REGEX.test(email)) {
      setEmailError('Please use a valid email address in your username.')
      valid = false
    } else {
      setEmailError(null)
    }

    if (password.length < 8) {
      setPasswordError('Please add a password with at least 8 characters.')
      valid = false
    } else {
      setPasswordError(null)
    }

    return valid
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitError(null)

    if (!validate()) return

    setSubmitting(true)
    try {
      await signup(email, password)
      navigate('/dashboard')
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Signup failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="signup">
      <MinimalHeader />
      <div className="signup__body">
        <div className="signup__card">
          <h1 className="signup__heading">Create an Account</h1>

          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="email">Username</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="gaya@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={emailError ? 'input--error' : ''}
            />
            {emailError && <p className="signup__field-error">{emailError}</p>}

            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={passwordError ? 'input--error' : ''}
            />
            {passwordError && <p className="signup__field-error">{passwordError}</p>}

            {submitError && <p className="signup__submit-error">{submitError}</p>}

            <button type="submit" className="btn btn--primary" disabled={submitting}>
              {submitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <Link to="/login" className="btn btn--outline signup__cancel-link">
            Cancel
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Signup