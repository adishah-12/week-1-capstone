import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../api/client'
import type { Recipe } from '../types/recipe'
import { extractErrorMessage } from '../types/api'
import './RecipeDetail.css'

function RecipeDetail() {
  const { id } = useParams<{ id: string }>()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchRecipe() {
      setLoading(true)
      setError(null)
      try {
        const res = await api.get<Recipe>(`/recipes/${id}`)
        if (!cancelled) setRecipe(res.data)
      } catch (err) {
        if (!cancelled) setError(extractErrorMessage(err, 'Could not load this recipe.'))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    if (id) fetchRecipe()
    return () => { cancelled = true }
  }, [id])

  if (loading) {
    return (
      <div className="recipe-detail">
        <div className="recipe-detail__content">
          <p>Loading recipe...</p>
        </div>
      </div>
    )
  }

  if (error || !recipe) {
    return (
      <div className="recipe-detail">
        <div className="recipe-detail__content">
          <p className="recipe-detail__error">{error ?? 'Recipe not found.'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="recipe-detail">
      <div className="recipe-detail__content">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link> {'>'} <Link to="/recipes">Recipe List</Link> {'>'} {recipe.title}
        </nav>

        <img className="recipe-detail__image" src={recipe.image} alt={recipe.title} />
        <h1 className="recipe-detail__title">{recipe.title}</h1>

        <section>
          <h2>Ingredients</h2>
          <ul className="recipe-detail__ingredients">
            {recipe.ingredients.map((ing, i) => (
              <li key={i}>{ing.quantity} {ing.name}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Instructions</h2>
          <p className="recipe-detail__instructions">
            {recipe.instructions
              .slice()
              .sort((a, b) => a.step - b.step)
              .map((instr) => instr.description)
              .join(' ')}
          </p>
        </section>

        <section>
          <h2>Tags</h2>
          <div className="recipe-detail__tags">
            {recipe.tags.map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default RecipeDetail