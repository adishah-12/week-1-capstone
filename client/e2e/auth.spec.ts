import { test, expect } from '@playwright/test'

const SEEDED_EMAIL = 'email@email.com'
const SEEDED_PASSWORD = 'password'

test.describe('Authentication', () => {
  test('logs in with valid credentials and reaches the dashboard', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill(SEEDED_EMAIL)
    await page.getByLabel('Password').fill(SEEDED_PASSWORD)
    await page.getByRole('button', { name: 'Login' }).click()

    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByRole('heading', { name: 'Your Recipes' })).toBeVisible()
  })

  test('shows an error with invalid credentials', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill(SEEDED_EMAIL)
    await page.getByLabel('Password').fill('definitely-wrong-password')
    await page.getByRole('button', { name: 'Login' }).click()

    await expect(page.getByText(/bad credentials|login failed/i)).toBeVisible()
    await expect(page).toHaveURL('/login')
  })

  test('redirects unauthenticated visitors away from /dashboard', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/login')
  })

  test('logs out and returns to a logged-out state', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill(SEEDED_EMAIL)
    await page.getByLabel('Password').fill(SEEDED_PASSWORD)
    await page.getByRole('button', { name: 'Login' }).click()
    await expect(page).toHaveURL('/dashboard')

    await page.getByLabel('Your profile').click()
    await expect(page).toHaveURL('/profile')

    await page.getByRole('button', { name: 'Log Out' }).click()
    await expect(page).toHaveURL('/login')

    // Confirm the guard actually re-engages, not just a visual redirect
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/login')
  })
})