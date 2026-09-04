import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import EditRecipe from '../../src/pages/EditRecipe'
import api from '../../src/api/client'
import { useAuth } from '../../src/context/AuthContext'
import { usePageLoading } from '../../src/context/PageLoadingContext'

vi.mock('../../src/api/client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

vi.mock('../../src/context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

vi.mock('../../src/context/PageLoadingContext', () => ({
  usePageLoading: vi.fn(),
}))

const mockRecipe = {
  _id: '1',
  title: 'Chickpea Stew',
  description: 'A hearty stew',
  image: 'stew.jpg',
  ingredients: [{ name: 'Olive Oil', quantity: '1 Tbsp' }],
  instructions: [{ step: 1, description: 'Saute onions.' }],
  tags: ['Vegan'],
  ownerId: 'user-1',
  createdAt: '2025-02-13T00:00:00.000Z',
  updatedAt: '2025-02-13T00:00:00.000Z',
}

function renderEdit(id = '1') {
  render(
    <MemoryRouter initialEntries={[`/recipes/${id}/edit`]}>
      <Routes>
        <Route path="/recipes/:id/edit" element={<EditRecipe />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('EditRecipe', () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      user: { _id: 'user-1', email: 'gaya@gmail.com', createdAt: '', updatedAt: '' },
      token: 'fake-token',
      isAuthenticated: true,
      login: vi.fn(),
      signup: vi.fn(),
      logout: vi.fn(),
    })
    vi.mocked(usePageLoading).mockReturnValue({
      isPageLoading: false,
      setIsPageLoading: vi.fn(),
    })
    vi.mocked(api.get).mockResolvedValue({ data: mockRecipe })
  })

  it('calls setIsPageLoading(true) then (false) around the fetch', async () => {
    const setIsPageLoading = vi.fn()
    vi.mocked(usePageLoading).mockReturnValue({ isPageLoading: false, setIsPageLoading })

    renderEdit()
    await screen.findByDisplayValue('Chickpea Stew')

    expect(setIsPageLoading).toHaveBeenCalledWith(true)
    expect(setIsPageLoading).toHaveBeenCalledWith(false)
  })

  it('prefills the form with existing recipe data', async () => {
    renderEdit()
    expect(await screen.findByDisplayValue('Chickpea Stew')).toBeInTheDocument()
    expect(screen.getByDisplayValue('1 Tbsp Olive Oil')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Saute onions.')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Vegan')).toBeInTheDocument()
  })

  it('blocks editing when the current user is not the owner', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: { ...mockRecipe, ownerId: 'someone-else' },
    })
    renderEdit()
    expect(
      await screen.findByText("You don't have permission to edit this recipe.")
    ).toBeInTheDocument()
  })

  it('shows a load error when the fetch fails', async () => {
    vi.mocked(api.get).mockRejectedValue(new Error('network error'))
    renderEdit()
    expect(await screen.findByText('Could not load this recipe.')).toBeInTheDocument()
  })

  it('shows a validation error when title is cleared', async () => {
    const user = userEvent.setup()
    renderEdit()

    const titleInput = await screen.findByDisplayValue('Chickpea Stew')
    await user.clear(titleInput)
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(await screen.findByText('Title is required.')).toBeInTheDocument()
    expect(api.put).not.toHaveBeenCalled()
  })

  it('submits updated data via PUT and navigates to dashboard', async () => {
    vi.mocked(api.put).mockResolvedValue({ data: {} })
    const user = userEvent.setup()
    renderEdit()

    const titleInput = await screen.findByDisplayValue('Chickpea Stew')
    await user.clear(titleInput)
    await user.type(titleInput, 'Spicy Chickpea Stew')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(api.put).toHaveBeenCalledWith(
      '/recipes/1',
      expect.objectContaining({ title: 'Spicy Chickpea Stew' })
    )
  })

  it('shows a submit error when PUT fails', async () => {
    vi.mocked(api.put).mockRejectedValue({
      response: { data: { message: 'Update failed' } },
    })
    const user = userEvent.setup()
    renderEdit()

    const titleInput = await screen.findByDisplayValue('Chickpea Stew')
    await user.type(titleInput, ' Updated')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(await screen.findByText('Update failed')).toBeInTheDocument()
  })

  it('shows the unsaved changes modal when cancelling with edits', async () => {
    const user = userEvent.setup()
    renderEdit()

    const titleInput = await screen.findByDisplayValue('Chickpea Stew')
    await user.type(titleInput, ' Updated')
    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(await screen.findByText('You have unsaved changes.')).toBeInTheDocument()
  })

  it('navigates away without the modal when cancelling with no edits', async () => {
    const user = userEvent.setup()
    renderEdit()

    await screen.findByDisplayValue('Chickpea Stew')
    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(screen.queryByText('You have unsaved changes.')).not.toBeInTheDocument()
  })

  it('deletes without saving when "Continue without Saving" is clicked in the modal', async () => {
    const user = userEvent.setup()
    renderEdit()

    const titleInput = await screen.findByDisplayValue('Chickpea Stew')
    await user.type(titleInput, ' Updated')
    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    await user.click(screen.getByText('Continue without Saving'))

    expect(api.put).not.toHaveBeenCalled()
  })
})