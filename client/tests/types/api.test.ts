import { describe, it, expect } from 'vitest'
import { extractErrorMessage } from '../../src/types/api'

describe('extractErrorMessage', () => {
  it('extracts a message field from an Axios-shaped error', () => {
    const error = { response: { data: { message: 'Cannot find recipe' } } }
    expect(extractErrorMessage(error)).toBe('Cannot find recipe')
  })

  it('extracts an err field when message is absent', () => {
    const error = { response: { data: { err: 'bad credentials' } } }
    expect(extractErrorMessage(error)).toBe('bad credentials')
  })

  it('prefers message over err when both are present', () => {
    const error = { response: { data: { message: 'M', err: 'E' } } }
    expect(extractErrorMessage(error)).toBe('M')
  })

  it('falls back to the default fallback when neither key exists', () => {
    const error = { response: { data: {} } }
    expect(extractErrorMessage(error)).toBe('Something went wrong.')
  })

  it('falls back to a custom fallback string when provided', () => {
    const error = { response: { data: {} } }
    expect(extractErrorMessage(error, 'Login failed.')).toBe('Login failed.')
  })

  it('falls back gracefully for a plain Error with no response', () => {
    expect(extractErrorMessage(new Error('network error'))).toBe('Something went wrong.')
  })

  it('falls back gracefully for a non-object thrown value', () => {
    expect(extractErrorMessage('a string was thrown')).toBe('Something went wrong.')
  })

  it('falls back gracefully for null or undefined', () => {
    expect(extractErrorMessage(null)).toBe('Something went wrong.')
    expect(extractErrorMessage(undefined)).toBe('Something went wrong.')
  })
})