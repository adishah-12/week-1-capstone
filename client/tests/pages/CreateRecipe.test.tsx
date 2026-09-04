import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import CreateRecipe from '../../src/pages/CreateRecipe'
import api from '../../src/api/client'

vi.mock('../../src/api/client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('CreateRecipe', () => {
  it('shows a validation error when title is empty', async () => {
    const user = userEvent.setup()
    render(<BrowserRouter><CreateRecipe /></BrowserRouter>)

    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(await screen.findByText('Title is required.')).toBeInTheDocument()
    expect(api.post).not.toHaveBeenCalled()
  })

  it('parses ingredients, instructions, and tags correctly on submit', async () => {
    vi.mocked(api.post).mockResolvedValue({ data: {} })
    const user = userEvent.setup()

    render(<BrowserRouter><CreateRecipe /></BrowserRouter>)

    await user.type(screen.getByLabelText('Title'), 'Spicy Chickpea Stew')
    await user.type(screen.getByLabelText('Ingredients'), '1 Tbsp Olive Oil, 1 Onion, Salt to taste')
    await user.type(
      screen.getByLabelText('Instructions'),
      'Saute onions in garlic.{enter}Add chickpeas and tomatoes.'
    )
    await user.type(screen.getByLabelText('Tags'), 'Vegan, Dinner')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(api.post).toHaveBeenCalledWith('/recipes', expect.objectContaining({
      title: 'Spicy Chickpea Stew',
      tags: ['Vegan', 'Dinner'],
      ingredients: [
        { quantity: '1 Tbsp', name: 'Olive Oil' },
        { quantity: '1', name: 'Onion' },
        { quantity: '', name: 'Salt to taste' },
      ],
      instructions: [
        { step: 1, description: 'Saute onions in garlic.' },
        { step: 2, description: 'Add chickpeas and tomatoes.' },
      ],
    }))
  })

  it('shows a submit error when the API call fails', async () => {
    vi.mocked(api.post).mockRejectedValue({
      response: { data: { message: 'Something went wrong' } },
    })
    const user = userEvent.setup()

    render(<BrowserRouter><CreateRecipe /></BrowserRouter>)

    await user.type(screen.getByLabelText('Title'), 'Test Recipe')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(await screen.findByText('Something went wrong')).toBeInTheDocument()
  })
})