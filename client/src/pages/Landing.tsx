import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Landing() {
  const { isAuthenticated } = useAuth()
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
}

export default Landing