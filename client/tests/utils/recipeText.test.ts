import { describe, it, expect } from 'vitest'
import {
  parseIngredients,
  ingredientsToText,
  parseInstructions,
  instructionsToText,
  parseTags,
  tagsToText,
} from '../../src/utils/recipeText'

describe('parseIngredients', () => {
  it('parses a quantity + unit + name', () => {
    expect(parseIngredients('1 Tbsp Olive Oil')).toEqual([
      { quantity: '1 Tbsp', name: 'Olive Oil' },
    ])
  })

  it('parses a fractional quantity', () => {
    expect(parseIngredients('1/2 Tsp Chili Flakes')).toEqual([
      { quantity: '1/2 Tsp', name: 'Chili Flakes' },
    ])
  })

  it('parses a bare number with no unit', () => {
    expect(parseIngredients('1 Onion')).toEqual([{ quantity: '1', name: 'Onion' }])
  })

  it('falls back to name-only when there is no leading quantity', () => {
    expect(parseIngredients('Salt to taste')).toEqual([
      { quantity: '', name: 'Salt to taste' },
    ])
  })

  it('splits multiple comma-separated ingredients', () => {
    expect(parseIngredients('1 Tbsp Olive Oil, 1 Onion, Salt to taste')).toEqual([
      { quantity: '1 Tbsp', name: 'Olive Oil' },
      { quantity: '1', name: 'Onion' },
      { quantity: '', name: 'Salt to taste' },
    ])
  })

  it('ignores empty segments from trailing/double commas', () => {
    expect(parseIngredients('1 Onion,, 2 Cloves Garlic,')).toEqual([
      { quantity: '1', name: 'Onion' },
      { quantity: '2 Cloves', name: 'Garlic' },
    ])
  })

  it('returns an empty array for empty input', () => {
    expect(parseIngredients('')).toEqual([])
  })
})

describe('ingredientsToText', () => {
  it('joins quantity and name with a comma-separated list', () => {
    const result = ingredientsToText([
      { quantity: '1 Tbsp', name: 'Olive Oil' },
      { quantity: '1', name: 'Onion' },
    ])
    expect(result).toBe('1 Tbsp Olive Oil, 1 Onion')
  })

  it('omits the quantity segment when quantity is empty', () => {
    const result = ingredientsToText([{ quantity: '', name: 'Salt to taste' }])
    expect(result).toBe('Salt to taste')
  })

  it('round-trips through parseIngredients for well-formed input', () => {
    const original = [
      { quantity: '1 Tbsp', name: 'Olive Oil' },
      { quantity: '1', name: 'Onion' },
    ]
    expect(parseIngredients(ingredientsToText(original))).toEqual(original)
  })
})

describe('parseInstructions', () => {
  it('numbers each non-empty line starting at 1', () => {
    expect(parseInstructions('Saute onions.\nAdd tomatoes.')).toEqual([
      { step: 1, description: 'Saute onions.' },
      { step: 2, description: 'Add tomatoes.' },
    ])
  })

  it('ignores blank lines', () => {
    expect(parseInstructions('Step one.\n\n\nStep two.')).toEqual([
      { step: 1, description: 'Step one.' },
      { step: 2, description: 'Step two.' },
    ])
  })

  it('returns an empty array for empty input', () => {
    expect(parseInstructions('')).toEqual([])
  })
})

describe('instructionsToText', () => {
  it('joins descriptions in step order regardless of input order', () => {
    const result = instructionsToText([
      { step: 2, description: 'Add tomatoes.' },
      { step: 1, description: 'Saute onions.' },
    ])
    expect(result).toBe('Saute onions.\nAdd tomatoes.')
  })
})

describe('parseTags', () => {
  it('splits and trims comma-separated tags', () => {
    expect(parseTags('Vegan,  Dinner ,Easy')).toEqual(['Vegan', 'Dinner', 'Easy'])
  })

  it('drops empty segments', () => {
    expect(parseTags('Vegan,, Dinner,')).toEqual(['Vegan', 'Dinner'])
  })

  it('returns an empty array for empty input', () => {
    expect(parseTags('')).toEqual([])
  })
})

describe('tagsToText', () => {
  it('joins tags with a comma and space', () => {
    expect(tagsToText(['Vegan', 'Dinner'])).toBe('Vegan, Dinner')
  })

  it('round-trips through parseTags', () => {
    const original = ['Vegan', 'Dinner', 'Easy']
    expect(parseTags(tagsToText(original))).toEqual(original)
  })
})