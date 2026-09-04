import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/client'
import type { RecipePayload } from '../types/recipe'
import { extractErrorMessage } from '../types/api'
import { parseIngredients, parseInstructions, parseTags } from '../utils/recipeText'
import './CreateRecipe.css'

function CreateRecipe() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [ingredientsText, setIngredientsText] = useState('')
  const [instructionsText, setInstructionsText] = useState('')
  const [tagsText, setTagsText] = useState('')
  const [image, setImage] = useState('')
  const [titleError, setTitleError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const navigate = useNavigate()

  function validate(): boolean {
    if (!title.trim()) {
      setTitleError('Title is required.')
      return false
    }
    setTitleError(null)
    return true
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitError(null)

    if (!validate()) return

    const payload: RecipePayload = {
      title: title.trim(),
      description: description.trim(),
      image: image.trim(),
      ingredients: parseIngredients(ingredientsText),
      instructions: parseInstructions(instructionsText),
      tags: parseTags(tagsText),
    }

    setSubmitting(true)
    try {
      await api.post('/recipes', payload)
      navigate('/dashboard')
    } catch (err) {
      setSubmitError(extractErrorMessage(err, 'Could not save recipe.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="create-recipe">
      <div className="create-recipe__content">
        <h1 className="create-recipe__heading">Create a Recipe</h1>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={titleError ? 'input--error' : ''}
          />
          {titleError && <p className="create-recipe__field-error">{titleError}</p>}

          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label htmlFor="ingredients">Ingredients</label>
          <textarea
            id="ingredients"
            rows={3}
            placeholder="1 Tbsp Olive Oil, 1 Onion, 2 Cloves Garlic..."
            value={ingredientsText}
            onChange={(e) => setIngredientsText(e.target.value)}
          />

          <label htmlFor="instructions">Instructions</label>
          <textarea
            id="instructions"
            rows={4}
            placeholder={'One step per line, e.g.\nSaute onions in garlic.\nAdd chickpeas and tomatoes, simmer for 20 mins.'}
            value={instructionsText}
            onChange={(e) => setInstructionsText(e.target.value)}
          />

          <label htmlFor="tags">Tags</label>
          <input
            id="tags"
            placeholder="Vegan, Gluten Free, Dinner"
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
          />

          <label htmlFor="image">Image</label>
          <input
            id="image"
            type="url"
            placeholder="https://example.com/image.jpg"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
          <div className="create-recipe__image-preview">
            {image ? (
              <img src={image} alt="Recipe preview" />
            ) : (
              <span className="create-recipe__image-placeholder">No image yet</span>
            )}
          </div>

          {submitError && <p className="create-recipe__submit-error">{submitError}</p>}

          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save'}
          </button>
          <Link to="/dashboard" className="btn btn--outline create-recipe__cancel">
            Cancel
          </Link>
        </form>
      </div>
    </div>
  )
}

export default CreateRecipe