// tests/jobs.spec.ts
import { test, expect } from '@playwright/test'
import { JobFormPage } from './pages/JobFormPage'
import { registerAndLogin } from './fixtures/auth'

test.describe('Job Applications', () => {

  test.beforeEach(async ({ page }) => {
    await registerAndLogin(page, `_jobs_${Date.now()}`)
  })

  // ── Add Job ───────────────────────────────────────────
  test('should add a new job application', async ({ page }) => {
    const form = new JobFormPage(page)
    await form.goto()

    await form.fillForm({
      company:  'Google Australia',
      position: 'Frontend Developer',
      status:   'applied',
      salary:   'AUD $90k - $120k',
      notes:    'Applied via LinkedIn',
    })
    await form.submit()

    // redirect ไป /jobs หลัง save
    await expect(page).toHaveURL('/jobs')
    await expect(page.getByText('Google Australia')).toBeVisible()
    await expect(page.getByText('Frontend Developer')).toBeVisible()
  })

  test('should show validation when required fields empty', async ({ page }) => {
    const form = new JobFormPage(page)
    await form.goto()
    await form.submit()

    // browser validation จะ block submit
    await expect(page).toHaveURL('/jobs/new')
  })

  test('should cancel and go back to jobs list', async ({ page }) => {
    const form = new JobFormPage(page)
    await form.goto()
    await form.cancelButton.click()
    await expect(page).toHaveURL('/jobs')
  })

  // ── Job List ──────────────────────────────────────────
  test('should show job list after adding job', async ({ page }) => {
    // Add a job first
    const form = new JobFormPage(page)
    await form.goto()
    await form.fillForm({ company: 'Atlassian', position: 'React Developer' })
    await form.submit()

    await expect(page).toHaveURL('/jobs')
    await expect(page.getByText('Atlassian')).toBeVisible()
  })

  test('should filter jobs by status', async ({ page }) => {
    // Add applied job
    const form = new JobFormPage(page)
    await form.goto()
    await form.fillForm({ company: 'Canva', position: 'UI Engineer', status: 'applied' })
    await form.submit()

    // filter by applied
    await page.getByRole('button', { name: '📤 Applied' }).click()
    await expect(page.getByText('Canva')).toBeVisible()

    // filter by interviewing — ไม่ควรเห็น Canva
    await page.getByRole('button', { name: '🎯 Interviewing' }).click()
    await expect(page.getByText('No applications found')).toBeVisible()
  })

  test('should search jobs by company name', async ({ page }) => {
    // Add job
    const form = new JobFormPage(page)
    await form.goto()
    await form.fillForm({ company: 'Afterpay', position: 'Full Stack Developer' })
    await form.submit()

    // search
    await page.getByPlaceholder('Search company or position...').fill('Afterpay')
    await page.getByRole('button', { name: 'Search' }).click()
    await expect(page.getByText('Afterpay')).toBeVisible()
  })

  test('should delete a job', async ({ page }) => {
    // Add job first
    const form = new JobFormPage(page)
    await form.goto()
    await form.fillForm({ company: 'DeleteMe Corp', position: 'Test Role' })
    await form.submit()

    await expect(page.getByText('DeleteMe Corp')).toBeVisible()

    // delete
    await page.locator('button').filter({ hasText: '🗑️' }).first().click()
    await expect(page.getByText('DeleteMe Corp')).not.toBeVisible()
  })
})
