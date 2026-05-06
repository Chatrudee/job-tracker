// tests/pages/DashboardPage.ts
import { type Page, type Locator } from '@playwright/test'

export class DashboardPage {
  readonly page:         Page
  readonly heading:      Locator
  readonly addJobButton: Locator
  readonly allJobsLink:  Locator
  readonly logoutButton: Locator
  readonly statsCards:   Locator
  readonly jobCards:     Locator

  constructor(page: Page) {
    this.page         = page
    this.heading      = page.getByText('Overview')
    this.addJobButton = page.getByRole('link', { name: '+ Add Job' })
    this.allJobsLink  = page.getByRole('link', { name: 'All Jobs' })
    this.logoutButton = page.getByRole('button', { name: 'Logout' })
    this.statsCards   = page.locator('.rounded-lg.border.p-5')
    this.jobCards     = page.locator('.rounded-lg.border.border-gray-200.bg-white.p-5')
  }

  async goto() {
    await this.page.goto('/dashboard')
  }

  async logout() {
    await this.logoutButton.click()
    await this.page.waitForURL('/login')  
  }

  async goToAddJob() {
    await this.addJobButton.click()
  }

  async goToAllJobs() {
    await this.allJobsLink.click()
  }
}
