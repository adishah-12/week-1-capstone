import type { Ingredient, Instruction } from '../types/recipe'

export function parseIngredientLine(line: string): Ingredient {
  const trimmed = line.trim()
  const match = trimmed.match(/^([\d]+\/[\d]+|[\d.]+)\s*([a-zA-Z]+)?\s+(.*)$/)
  if (match) {
    const [, amount, unit, name] = match
    return {
      quantity: unit ? `${amount} ${unit}` : amount,
      name: name.trim() || trimmed,
    }
  }
  return { quantity: '', name: trimmed }
}

export function parseIngredients(text: string): Ingredient[] {
  return text
    .split(',')
    .map((line) => line.trim())
    .filter(Boolean)
    .map(parseIngredientLine)
}

export function ingredientsToText(ingredients: Ingredient[]): string {
  return ingredients
    .map((ing) => (ing.quantity ? `${ing.quantity} ${ing.name}` : ing.name))
    .join(', ')
}

export function parseInstructions(text: string): Instruction[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((description, i) => ({ step: i + 1, description }))
}

export function instructionsToText(instructions: Instruction[]): string {
  return instructions
    .slice()
    .sort((a, b) => a.step - b.step)
    .map((instr) => instr.description)
    .join('\n')
}

export function parseTags(text: string): string[] {
  return text
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
}

export function tagsToText(tags: string[]): string {
  return tags.join(', ')
}