import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import { usePageLoading } from '../context/PageLoadingContext'
import RecipeCard from './components/RecipeCard'
import ConfirmModal from './components/ConfirmModal'
import Toast from './components/Toast'
import type { Recipe } from '../types/recipe'
import { extractErrorMessage } from '../types/api'
import './Dashboard.css'

function Dashboard() {
  const { user } = useAuth()
  const { setIsPageLoading } = usePageLoading()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    fetchRecipes()
  }, [])

  async function fetchRecipes() {
    setLoading(true)
    setIsPageLoading(true)
    try {
      const res = await api.get<Recipe[]>('/recipes')
      setRecipes(res.data)
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not load your recipes.'))
    } finally {
      setLoading(false)
      setIsPageLoading(false)
    }
  }

  const myRecipes = useMemo(
    () => recipes.filter((r) => r.ownerId === user?._id),
    [recipes, user]
  )

  async function handleConfirmDelete() {
    if (!recipeToDelete) return
    try {
      await api.delete(`/recipes/${recipeToDelete._id}`)
      setRecipes((prev) => prev.filter((r) => r._id !== recipeToDelete._id))
      setToastMessage('Your recipe was successfully deleted.')
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not delete recipe.'))
    } finally {
      setRecipeToDelete(null)
    }
  }

  if (loading) {
    return null
  }

  return (
    <div className="dashboard">
      <div className="dashboard__content">
        {toastMessage && (
          <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
        )}

        <p className="dashboard__welcome">Welcome back! Manage your recipes or add a new one.</p>
        <h1 className="dashboard__heading">Your Recipes</h1>

        {error && <p className="dashboard__error">{error}</p>}

        {!error && myRecipes.length === 0 && (
          <div className="dashboard__empty">
            <p>Your recipes will show up here.</p>
          </div>
        )}

        {myRecipes.length > 0 && (
          <div className="dashboard__grid">
            {myRecipes.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                recipe={recipe}
                onDelete={(r) => setRecipeToDelete(r)}
              />
            ))}
          </div>
        )}

        <Link to="/recipes/new" className="btn btn--primary dashboard__create-btn">
          Create Recipe
        </Link>
        <Link to="/recipes" className="btn btn--outline dashboard__browse-btn">
          Browse Recipes
        </Link>

        {recipeToDelete && (
          <ConfirmModal
            title="Delete recipe?"
            message="Do you want to delete this recipe? This action cannot be undone."
            confirmLabel="Yes, Delete Recipe"
            onConfirm={handleConfirmDelete}
            onCancel={() => setRecipeToDelete(null)}
          />
        )}
      </div>
    </div>
  )
}

export default Dashboard