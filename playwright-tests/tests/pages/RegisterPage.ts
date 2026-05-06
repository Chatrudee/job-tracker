// tests/pages/RegisterPage.ts
import { type Page, type Locator } from '@playwright/test'

export class RegisterPage {
  readonly page:            Page
  readonly firstNameInput:  Locator
  readonly lastNameInput:   Locator
  readonly usernameInput:   Locator
  readonly emailInput:      Locator
  readonly passwordInput:   Locator
  readonly password2Input:  Locator
  readonly submitButton:    Locator
  readonly errorMessage:    Locator

  constructor(page: Page) {
    this.page           = page
    this.firstNameInput = page.getByPlaceholder('First name')
    this.lastNameInput  = page.getByPlaceholder('Last name')
    this.usernameInput  = page.getByPlaceholder('Username')
    this.emailInput     = page.getByPlaceholder('you@example.com')
    this.passwordInput  = page.getByPlaceholder('Password *', { exact: true })
    this.password2Input = page.getByPlaceholder('Confirm password *', { exact: true })
    this.submitButton   = page.getByRole('button', { name: 'Create account' })
    this.errorMessage   = page.locator('.bg-red-50')
  }

  async goto() {
    await this.page.goto('/register')
  }

  async register(data: {
    firstName?: string
    lastName?: string
    username: string
    email: string
    password: string
  }) {
    if (data.firstName) await this.firstNameInput.fill(data.firstName)
    if (data.lastName)  await this.lastNameInput.fill(data.lastName)
    await this.usernameInput.fill(data.username)
    await this.emailInput.fill(data.email)
    await this.passwordInput.fill(data.password)
    await this.password2Input.fill(data.password)
    await this.submitButton.click()
  }
}
