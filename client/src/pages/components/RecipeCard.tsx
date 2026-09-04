import { Link } from 'react-router-dom'
import type { Recipe } from '../../types/recipe'
import './RecipeCard.css'
import TrashIcon from './TrashIcon'
import PencilIcon from './PencilIcon'

interface RecipeCardProps {
  recipe: Recipe
  onDelete?: (recipe: Recipe) => void
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: '2-digit',
  })
}

function RecipeCard({ recipe, onDelete }: RecipeCardProps) {
  const isOwnerView = !!onDelete

  return (
    <div className="recipe-card">
      <img className="recipe-card__image" src={recipe.image} alt={recipe.title} />
      <div className="recipe-card__body">
        <h3 className="recipe-card__title">{recipe.title}</h3>
        <p className="recipe-card__date">Created on {formatDate(recipe.createdAt)}</p>
        <div className="recipe-card__tags">
          {recipe.tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>

        {isOwnerView ? (
          <div className="recipe-card__owner-actions">
            <button
              className="recipe-card__icon-btn"
              aria-label={`Delete ${recipe.title}`}
              onClick={() => onDelete(recipe)}
            >
              <TrashIcon />
            </button>
            <Link
              to={`/recipes/${recipe._id}/edit`}
              className="recipe-card__icon-btn"
              aria-label={`Edit ${recipe.title}`}
            >
              <PencilIcon />
            </Link>
          </div>
        ) : (
          <Link to={`/recipes/${recipe._id}`} className="recipe-card__link">
            View Recipe
          </Link>
        )}
      </div>
    </div>
  )
}

export default RecipeCard