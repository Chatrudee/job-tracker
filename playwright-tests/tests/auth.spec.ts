// tests/auth.spec.ts
import { test, expect } from '@playwright/test'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { TEST_USER, registerAndLogin } from './fixtures/auth'

// ── Register Tests ────────────────────────────────────────
test.describe('Register', () => {

  test('should register successfully and redirect to dashboard', async ({ page }) => {
    const timestamp    = Date.now()
    const registerPage = new RegisterPage(page)

    await registerPage.goto()
    await registerPage.register({
      username:  `testuser_${timestamp}`,
      email:     `test_${timestamp}@test.com`,
      password:  'TestPass123!',
      firstName: 'Test',
      lastName:  'User',
    })

    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByText('Overview')).toBeVisible()
  })

  test('should show error when passwords do not match', async ({ page }) => {
    const registerPage = new RegisterPage(page)
    await registerPage.goto()

    await registerPage.firstNameInput.fill('Test')
    await registerPage.usernameInput.fill('anyuser')
    await registerPage.emailInput.fill('any@test.com')
    await registerPage.passwordInput.fill('TestPass123!')
    await registerPage.password2Input.fill('DifferentPass!')
    await registerPage.submitButton.click()

    await expect(page.getByText('Passwords do not match')).toBeVisible()
  })

  test('should have link to login page', async ({ page }) => {
    const registerPage = new RegisterPage(page)
    await registerPage.goto()
    await page.getByRole('link', { name: 'Sign in' }).click()
    await expect(page).toHaveURL('/login')
  })
})

// ── Login Tests ───────────────────────────────────────────
test.describe('Login', () => {

  test.skip('should show error with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login('wronguser', 'wrongpassword')
    await expect(loginPage.errorMessage).toBeVisible()
  })

  test('should have link to register page', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.signUpLink.click()
    await expect(page).toHaveURL('/register')
  })

  test('should show dashboard after register', async ({ page }) => {
    await registerAndLogin(page, `_redirect_${Date.now()}`)
    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByText('Overview')).toBeVisible()
  })
})
