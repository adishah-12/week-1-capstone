import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import { usePageLoading } from '../context/PageLoadingContext'
import ConfirmModal from './components/ConfirmModal'
import type { Recipe, RecipePayload } from '../types/recipe'
import { extractErrorMessage } from '../types/api'
import {
  parseIngredients,
  ingredientsToText,
  parseInstructions,
  instructionsToText,
  parseTags,
  tagsToText,
  normalizePayload,
} from '../utils/recipeText'
import './CreateRecipe.css' // shared styling 

function EditRecipe() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { setIsPageLoading } = usePageLoading()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [unauthorized, setUnauthorized] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [ingredientsText, setIngredientsText] = useState('')
  const [instructionsText, setInstructionsText] = useState('')
  const [tagsText, setTagsText] = useState('')
  const [image, setImage] = useState('')

  const [initial, setInitial] = useState<RecipePayload | null>(null)
  const [titleError, setTitleError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [showUnsavedModal, setShowUnsavedModal] = useState(false)

  useEffect(() => {
    async function fetchRecipe() {
      setIsPageLoading(true)
      try {
        const res = await api.get<Recipe>(`/recipes/${id}`)
        const recipe = res.data

        if (recipe.ownerId !== user?._id) {
          setUnauthorized(true)
          return
        }

        setTitle(recipe.title)
        setDescription(recipe.description ?? '')
        setIngredientsText(ingredientsToText(recipe.ingredients))
        setInstructionsText(instructionsToText(recipe.instructions))
        setTagsText(tagsToText(recipe.tags))
        setImage(recipe.image ?? '')

        setInitial({
          title: recipe.title,
          description: recipe.description ?? '',
          image: recipe.image ?? '',
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          tags: recipe.tags,
        })
      } catch (err) {
        setLoadError(extractErrorMessage(err, 'Could not load this recipe.'))
      } finally {
        setLoading(false)
        setIsPageLoading(false)
      }
    }

    if (id) fetchRecipe()
  }, [id, user])

  function buildPayload(): RecipePayload {
    return {
      title: title.trim(),
      description: description.trim(),
      image: image.trim(),
      ingredients: parseIngredients(ingredientsText),
      tags: parseTags(tagsText),
      instructions: parseInstructions(instructionsText),
    }
  }

  function isDirty(): boolean {
  if (!initial) return false
  return normalizePayload(buildPayload()) !== normalizePayload(initial)
}

  async function saveChanges() {
    if (!title.trim()) {
      setTitleError('Title is required.')
      return false
    }
    setTitleError(null)

    setSubmitting(true)
    try {
      await api.put(`/recipes/${id}`, buildPayload())
      return true
    } catch (err) {
      setSubmitError(extractErrorMessage(err, 'Could not save changes.'))
      return false
    } finally {
      setSubmitting(false)
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitError(null)
    const success = await saveChanges()
    if (success) navigate('/dashboard')
  }

  function handleCancelClick() {
    if (isDirty()) {
      setShowUnsavedModal(true)
    } else {
      navigate('/dashboard')
    }
  }

  async function handleSaveAndLeave() {
    const success = await saveChanges()
    setShowUnsavedModal(false)
    if (success) navigate('/dashboard')
  }

  function handleLeaveWithoutSaving() {
    setShowUnsavedModal(false)
    navigate('/dashboard')
  }

  if (loading) {
    return null
  }

  if (unauthorized) {
    return (
      <div className="create-recipe">
        <div className="create-recipe__content">
          <p className="create-recipe__submit-error">
            You don't have permission to edit this recipe.
          </p>
          <Link to="/dashboard" className="btn btn--outline">Back to Dashboard</Link>
        </div>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="create-recipe">
        <div className="create-recipe__content">
          <p className="create-recipe__submit-error">{loadError}</p>
        </div>
      </div>
    )
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
            value={ingredientsText}
            onChange={(e) => setIngredientsText(e.target.value)}
          />

          <label htmlFor="instructions">Instructions</label>
          <textarea
            id="instructions"
            rows={4}
            value={instructionsText}
            onChange={(e) => setInstructionsText(e.target.value)}
          />

          <label htmlFor="tags">Tags</label>
          <input
            id="tags"
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
          />

          <label htmlFor="image">Image</label>
          <input
            id="image"
            type="url"
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
          <button
            type="button"
            className="btn btn--outline create-recipe__cancel"
            onClick={handleCancelClick}
          >
            Cancel
          </button>
        </form>
      </div>

      {showUnsavedModal && (
        <ConfirmModal
          title="You have unsaved changes."
          message="Do you want to proceed without saving your changes?"
          confirmLabel="Save Changes"
          cancelLabel="Continue without Saving"
          onConfirm={handleSaveAndLeave}
          onCancel={handleLeaveWithoutSaving}
        />
      )}
    </div>
  )
}

export default EditRecipe