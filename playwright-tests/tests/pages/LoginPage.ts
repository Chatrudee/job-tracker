// tests/pages/LoginPage.ts
import { type Page, type Locator } from '@playwright/test'

export class LoginPage {
  readonly page:        Page
  readonly usernameInput: Locator
  readonly passwordInput: Locator
  readonly submitButton:  Locator
  readonly errorMessage:  Locator
  readonly signUpLink:    Locator

  constructor(page: Page) {
    this.page          = page
    this.usernameInput = page.getByPlaceholder('Enter your username')
    this.passwordInput = page.getByPlaceholder('Enter your password')
    this.submitButton  = page.getByRole('button', { name: 'Sign in' })
    this.errorMessage = page.locator('.bg-red-50')
    this.signUpLink    = page.getByRole('link', { name: 'Sign up' })
  }

  async goto() {
    await this.page.goto('/login')
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username)
    await this.passwordInput.fill(password)
    await this.submitButton.click()
  }
}
