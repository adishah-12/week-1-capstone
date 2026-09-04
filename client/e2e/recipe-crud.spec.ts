import { test, expect } from '@playwright/test'

const SEEDED_EMAIL = 'email@email.com'
const SEEDED_PASSWORD = 'password'

async function login(page: import('@playwright/test').Page) {
  await page.goto('/login')
  await page.getByLabel('Email').fill(SEEDED_EMAIL)
  await page.getByLabel('Password').fill(SEEDED_PASSWORD)
  await page.getByRole('button', { name: 'Login' }).click()
  await expect(page).toHaveURL('/dashboard')
}

test.describe('Recipe CRUD', () => {
  test('creates, edits, and deletes a recipe end to end', async ({ page }) => {
    const uniqueTitle = `E2E Test Recipe ${Date.now()}`
    const updatedTitle = `${uniqueTitle} (edited)`

    await login(page)

    // CREATE
    await page.getByRole('link', { name: 'Create Recipe' }).click()
    await expect(page).toHaveURL('/recipes/new')

    await page.getByLabel('Title').fill(uniqueTitle)
    await page.getByLabel('Description').fill('Created by an automated e2e test.')
    await page.getByLabel('Ingredients').fill('1 Cup Flour, 2 Eggs')
    await page.getByLabel('Instructions').fill('Mix ingredients.\nBake for 20 minutes.')
    await page.getByLabel('Tags').fill('Test')
    await page.getByRole('button', { name: 'Save' }).click()

    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByText(uniqueTitle)).toBeVisible()

    // EDIT
    await page
      .locator('.recipe-card', { hasText: uniqueTitle })
      .getByLabel(`Edit ${uniqueTitle}`)
      .click()

    const titleInput = page.getByLabel('Title')
    await titleInput.fill(updatedTitle)
    await page.getByRole('button', { name: 'Save' }).click()

    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByText(updatedTitle)).toBeVisible()
    await expect(page.getByText(uniqueTitle, { exact: true })).not.toBeVisible()

    // DELETE
    await page
      .locator('.recipe-card', { hasText: updatedTitle })
      .getByLabel(`Delete ${updatedTitle}`)
      .click()

    await expect(page.getByText('Delete recipe?')).toBeVisible()
    await page.getByRole('button', { name: 'Yes, Delete Recipe' }).click()

    await expect(page.getByText('Your recipe was successfully deleted.')).toBeVisible()
    await expect(page.getByText(updatedTitle)).not.toBeVisible()
  })

  test('shows the unsaved-changes modal when leaving Edit with unsaved edits', async ({ page }) => {
    const uniqueTitle = `E2E Guard Test ${Date.now()}`

    await login(page)

    await page.getByRole('link', { name: 'Create Recipe' }).click()
    await page.getByLabel('Title').fill(uniqueTitle)
    await page.getByLabel('Ingredients').fill('1 item')
    await page.getByLabel('Instructions').fill('Step one.')
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.getByText(uniqueTitle)).toBeVisible()

    // Enter edit, make a change, try to cancel
    await page
      .locator('.recipe-card', { hasText: uniqueTitle })
      .getByLabel(`Edit ${uniqueTitle}`)
      .click()

    await page.getByLabel('Title').fill(`${uniqueTitle} unsaved change`)
    await page.getByRole('button', { name: 'Cancel' }).click()

    await expect(page.getByText('You have unsaved changes.')).toBeVisible()
    await page.getByText('Continue without Saving').click()
    await expect(page).toHaveURL('/dashboard')

    // Cleanup: delete what this test created
    await page
      .locator('.recipe-card', { hasText: uniqueTitle })
      .getByLabel(`Delete ${uniqueTitle}`)
      .click()
    await page.getByRole('button', { name: 'Yes, Delete Recipe' }).click()
    await expect(page.getByText(uniqueTitle)).not.toBeVisible()
  })
})