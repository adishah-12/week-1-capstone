export interface User {
  _id: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  token: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface SignupPayload {
  email: string
  password: string
}