import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import RecipeDetail from '../../src/pages/RecipeDetail'
import api from '../../src/api/client'

vi.mock('../../src/api/client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

const mockRecipe = {
  _id: '1',
  title: 'Spicy Chickpea Stew',
  description: '',
  image: 'stew.jpg',
  ingredients: [{ name: 'Olive Oil', quantity: '1 Tbsp' }],
  instructions: [
    { step: 2, description: 'Add chickpeas and tomatoes, simmer for 20 mins.' },
    { step: 1, description: 'Saute onions in garlic.' },
  ],
  tags: ['Vegan', 'Dinner', 'Easy'],
  ownerId: 'user-1',
  createdAt: '2025-02-13T00:00:00.000Z',
  updatedAt: '2025-02-13T00:00:00.000Z',
}

function renderWithRoute(id: string) {
  render(
    <MemoryRouter initialEntries={[`/recipes/${id}`]}>
      <Routes>
        <Route path="/recipes/:id" element={<RecipeDetail />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('RecipeDetail', () => {
  beforeEach(() => {
    vi.mocked(api.get).mockResolvedValue({ data: mockRecipe })
  })

  it('fetches and displays the recipe by id', async () => {
    renderWithRoute('1')

    expect(await screen.findByText('Spicy Chickpea Stew')).toBeInTheDocument()
    expect(api.get).toHaveBeenCalledWith('/recipes/1')
  })

  it('renders ingredients with quantity and name', async () => {
    renderWithRoute('1')
    expect(await screen.findByText('1 Tbsp Olive Oil')).toBeInTheDocument()
  })

  it('renders instructions sorted by step', async () => {
    renderWithRoute('1')
    const instructions = await screen.findByText(/Saute onions in garlic\..*Add chickpeas/s)
    expect(instructions).toBeInTheDocument()
  })

  it('renders all tags', async () => {
    renderWithRoute('1')
    expect(await screen.findByText('Vegan')).toBeInTheDocument()
    expect(await screen.findByText('Dinner')).toBeInTheDocument()
    expect(await screen.findByText('Easy')).toBeInTheDocument()
  })

  it('shows an error state when the fetch fails', async () => {
    vi.mocked(api.get).mockRejectedValue(new Error('network error'))
    renderWithRoute('999')
    expect(await screen.findByText('Could not load this recipe.')).toBeInTheDocument()
  })
})