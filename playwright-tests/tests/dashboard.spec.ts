// tests/dashboard.spec.ts
import { test, expect } from '@playwright/test'
import { DashboardPage } from './pages/DashboardPage'
import { registerAndLogin } from './fixtures/auth'

test.describe('Dashboard', () => {

  test.beforeEach(async ({ page }) => {
    await registerAndLogin(page, `_dash_${Date.now()}`)
  })

  test('should show overview section', async ({ page }) => {
    await expect(page.getByText('Overview')).toBeVisible()
  })

  test('should show stats cards', async ({ page }) => {
    await expect(page.getByText('Total')).toBeVisible()
    await expect(page.getByText('Applied')).toBeVisible()
    await expect(page.getByText('Interviewing')).toBeVisible()
    await expect(page.getByText('Offered')).toBeVisible()
  })

  test('should show empty state when no jobs', async ({ page }) => {
    await expect(page.getByText('No applications yet')).toBeVisible()
    await expect(page.getByText('+ Add Your First Job')).toBeVisible()
  })

  test('should navigate to add job page', async ({ page }) => {
    const dashboard = new DashboardPage(page)
    await dashboard.goToAddJob()
    await expect(page).toHaveURL('/jobs/new')
  })

  test('should navigate to all jobs page', async ({ page }) => {
    const dashboard = new DashboardPage(page)
    await dashboard.goToAllJobs()
    await expect(page).toHaveURL('/jobs')
  })

  test('should logout successfully', async ({ page }) => {
    const dashboard = new DashboardPage(page)
    await dashboard.logout()
    await expect(page).toHaveURL('/login')
  })
})
