import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Browse from './pages/Browse'
import Dashboard from './pages/Dashboard'
import AppLayout from './pages/components/AppLayout'
import ProtectedRoute from './pages/components/ProtectedRoute'

function App() {
  return (
    <Routes>
      {/* No header */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Header, public */}
      <Route element={<AppLayout />}>
        <Route path="/recipes" element={<Browse />} />

        {/* Header + auth guard, both required */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App