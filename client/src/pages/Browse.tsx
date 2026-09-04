import { useEffect, useMemo, useState } from 'react'
import api from '../api/client'
import RecipeCard from './components/RecipeCard'
import type { Recipe } from '../types/recipe'
import './Browse.css'

function Browse() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchRecipes() {
      try {
        const res = await api.get<Recipe[]>('/recipes')
        if (!cancelled) setRecipes(res.data)
      } catch {
        if (!cancelled) setError('Could not load recipes. Please try again later.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchRecipes()
    return () => { cancelled = true }
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return recipes

    return recipes.filter((recipe) => {
      const titleMatch = recipe.title.toLowerCase().includes(q)
      const tagMatch = recipe.tags.some((tag) => tag.toLowerCase().includes(q))
      const ingredientMatch = recipe.ingredients.some((ing) =>
        ing.name.toLowerCase().includes(q)
      )
      return titleMatch || tagMatch || ingredientMatch
    })
  }, [recipes, query])

  return (
    <div className="browse">
      <div className="browse__content">
        <h1 className="browse__heading">Recipe List</h1>
        <input
          className="browse__search"
          type="text"
          placeholder="Search recipes"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {loading && <p>Loading recipes...</p>}
        {error && <p className="browse__error">{error}</p>}

        {!loading && !error && filtered.length === 0 && (
          <p className="browse__empty">We couldn't find any recipes.</p>
        )}

        <div className="browse__list">
          {filtered.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Browse