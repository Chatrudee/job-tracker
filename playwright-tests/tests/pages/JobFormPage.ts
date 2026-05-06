// tests/pages/JobFormPage.ts
import { type Page, type Locator } from '@playwright/test'

export class JobFormPage {
  readonly page:           Page
  readonly companyInput:   Locator
  readonly positionInput:  Locator
  readonly statusSelect:   Locator
  readonly dateInput:      Locator
  readonly salaryInput:    Locator
  readonly notesInput:     Locator
  readonly submitButton:   Locator
  readonly cancelButton:   Locator

  constructor(page: Page) {
    this.page          = page
    this.companyInput  = page.getByPlaceholder('Google, Atlassian...')
    this.positionInput = page.getByPlaceholder('Frontend Developer...')
    this.statusSelect  = page.locator('select')
    this.dateInput     = page.locator('input[type="date"]')
    this.salaryInput   = page.getByPlaceholder('AUD $80k - $100k')
    this.notesInput    = page.getByPlaceholder('Interview notes, contacts, requirements...')
    this.submitButton  = page.getByRole('button', { name: 'Save Application' })
    this.cancelButton  = page.getByRole('link', { name: 'Cancel' })
  }

  async goto() {
    await this.page.goto('/jobs/new')
  }

  async fillForm(data: {
    company: string
    position: string
    status?: string
    salary?: string
    notes?: string
  }) {
    await this.companyInput.fill(data.company)
    await this.positionInput.fill(data.position)
    if (data.status)  await this.statusSelect.selectOption(data.status)
    if (data.salary)  await this.salaryInput.fill(data.salary)
    if (data.notes)   await this.notesInput.fill(data.notes)
  }

  async submit() {
    await this.submitButton.click()
  }
}
