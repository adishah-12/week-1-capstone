export interface ApiErrorShape {
  message?: string
  err?: string
  [key: string]: unknown
}

export function extractErrorMessage(error: unknown, fallback = 'Something went wrong.'): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as { response?: { data?: ApiErrorShape } }).response?.data === 'object'
  ) {
    const data = (error as { response: { data: ApiErrorShape } }).response.data
    return data.message ?? data.err ?? fallback
  }
  return fallback
}