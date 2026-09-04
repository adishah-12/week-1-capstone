import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Browse from './pages/Browse'
import Dashboard from './pages/Dashboard'
import AppLayout from './pages/components/AppLayout'
import ProtectedRoute from './pages/components/ProtectedRoute'
import RecipeDetail from './pages/RecipeDetail'
import CreateRecipe from './pages/CreateRecipe'
import Profile from './pages/Profile'
import EditRecipe from './pages/EditRecipe'
import Footer from './pages/components/Footer'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<AppLayout />}>
          <Route path="/recipes" element={<Browse />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/recipes/:id/edit" element={<EditRecipe />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/recipes/new" element={<CreateRecipe />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
      <Footer />
    </>
  )
}

export default App