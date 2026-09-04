import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Browse from '../../src/pages/Browse'
import api from '../../src/api/client'

vi.mock('../api/client')

const mockRecipes = [
  {
    _id: '1',
    title: 'Chickpea Stew',
    description: '',
    image: 'stew.jpg',
    ingredients: [{ name: 'Chickpeas', quantity: '1 can' }],
    instructions: [],
    tags: ['Vegan', 'Easy'],
    createdAt: '2025-02-13T00:00:00.000Z',
  },
  {
    _id: '2',
    title: 'Caesar Salad',
    description: '',
    image: 'salad.jpg',
    ingredients: [{ name: 'Romaine', quantity: '1 head' }],
    instructions: [],
    tags: ['Salad', 'Quick'],
    createdAt: '2025-02-13T00:00:00.000Z',
  },
]

describe('Browse', () => {
  beforeEach(() => {
    vi.mocked(api.get).mockResolvedValue({ data: mockRecipes })
  })

  it('renders recipes after fetch', async () => {
    render(<BrowserRouter><Browse /></BrowserRouter>)
    expect(await screen.findByText('Chickpea Stew')).toBeInTheDocument()
    expect(screen.getByText('Caesar Salad')).toBeInTheDocument()
  })

  it('filters recipes by search query', async () => {
    const user = userEvent.setup()
    render(<BrowserRouter><Browse /></BrowserRouter>)
    await screen.findByText('Chickpea Stew')

    await user.type(screen.getByPlaceholderText('Search recipes'), 'caesar')

    expect(screen.queryByText('Chickpea Stew')).not.toBeInTheDocument()
    expect(screen.getByText('Caesar Salad')).toBeInTheDocument()
  })

  it('shows empty state when no matches', async () => {
    const user = userEvent.setup()
    render(<BrowserRouter><Browse /></BrowserRouter>)
    await screen.findByText('Chickpea Stew')

    await user.type(screen.getByPlaceholderText('Search recipes'), 'zzz')

    expect(await screen.findByText("We couldn't find any recipes.")).toBeInTheDocument()
  })
})