export interface Ingredient {
  name: string
  quantity: string
}

export interface Instruction {
  step: number
  description: string
}

export interface Recipe {
  _id: string
  title: string
  description: string
  image: string
  ingredients: Ingredient[]
  instructions: Instruction[]
  tags: string[]
  ownerId: string
  createdAt: string
  updatedAt: string
}

// Shape sent to POST/PUT — no _id, ownerId, or timestamps,
export interface RecipePayload {
  title: string
  description: string
  image: string
  ingredients: Ingredient[]
  instructions: Instruction[]
  tags: string[]
}