import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Dashboard from '../../src/pages/Dashboard'
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


const mockRecipes = [
  {
    _id: '1',
    title: 'Chickpea Stew',
    description: '',
    image: 'stew.jpg',
    ingredients: [],
    instructions: [],
    tags: ['Vegan'],
    ownerId: 'user-1',
    createdAt: '2025-02-13T00:00:00.000Z',
    updatedAt: '2025-02-13T00:00:00.000Z',
  },
  {
    _id: '2',
    title: 'Someone Else\'s Salad',
    description: '',
    image: 'salad.jpg',
    ingredients: [],
    instructions: [],
    tags: ['Salad'],
    ownerId: 'other-user',
    createdAt: '2025-02-13T00:00:00.000Z',
    updatedAt: '2025-02-13T00:00:00.000Z',
  },
]

describe('Dashboard', () => {
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
    vi.mocked(api.get).mockResolvedValue({ data: mockRecipes })
  })

  it('only shows recipes owned by the current user', async () => {
    render(<BrowserRouter><Dashboard /></BrowserRouter>)

    expect(await screen.findByText('Chickpea Stew')).toBeInTheDocument()
    expect(screen.queryByText("Someone Else's Salad")).not.toBeInTheDocument()
  })

  it('shows a confirm modal and deletes on confirmation', async () => {
    vi.mocked(api.delete).mockResolvedValue({ data: { message: 'Deleted Recipe' } })
    const user = userEvent.setup()

    render(<BrowserRouter><Dashboard /></BrowserRouter>)
    await screen.findByText('Chickpea Stew')

    await user.click(screen.getByLabelText('Delete Chickpea Stew'))
    expect(screen.getByText('Delete recipe?')).toBeInTheDocument()

    await user.click(screen.getByText('Yes, Delete Recipe'))

    expect(api.delete).toHaveBeenCalledWith('/recipes/1')
    expect(await screen.findByText('Your recipe was successfully deleted.')).toBeInTheDocument()
  })

  it('shows empty state when user has no recipes', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: [] })
    render(<BrowserRouter><Dashboard /></BrowserRouter>)

    expect(await screen.findByText('Your recipes will show up here.')).toBeInTheDocument()
  })
})