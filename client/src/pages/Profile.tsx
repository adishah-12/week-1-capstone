import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ConfirmModal from './components/ConfirmModal'
import Toast from './components/Toast'
import './Profile.css'

function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState(user?.email ?? '')
  const [password, setPassword] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  function handleSave() {
    setToastMessage('Account updates are not available yet — this button is a placeholder.')
  }

  function handleDeleteClick() {
    setShowDeleteModal(true)
  }

  function handleConfirmDelete() {
    setShowDeleteModal(false)
    setToastMessage('Account deletion is not available yet — this button is a placeholder.')
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="profile">
      <div className="profile__content">
        {toastMessage && (
          <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
        )}

        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <a href="/">Home</a> {'>'} Your Profile
        </nav>

        <h1 className="profile__heading">Your Profile</h1>

        <label htmlFor="email">Username</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••••••"
        />

        <button type="button" className="btn btn--primary" onClick={handleSave}>
          Save Changes
        </button>
        <button type="button" className="btn btn--outline" onClick={handleLogout}>
          Log Out
        </button>
        <button type="button" className="profile__delete-link" onClick={handleDeleteClick}>
          Delete Account
        </button>
      </div>

      {showDeleteModal && (
        <ConfirmModal
          title="Delete account?"
          message="Do you want to delete your account? This action cannot be undone."
          confirmLabel="Yes, Delete Account"
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  )
}

export default Profile