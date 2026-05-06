// tests/fixtures/auth.ts
// Helper functions สำหรับ test — login อัตโนมัติ

import { type Page } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'
import { RegisterPage } from '../pages/RegisterPage'

// Test user credentials
export const TEST_USER = {
  username:  'playwright_test',
  email:     'playwright@test.com',
  password:  'TestPass123!',
  firstName: 'Playwright',
  lastName:  'Test',
}

// Login helper — ใช้ซ้ำได้ใน test ทุกตัว
export async function loginAs(page: Page, username = TEST_USER.username, password = TEST_USER.password) {
  const loginPage = new LoginPage(page)
  await loginPage.goto()
  await loginPage.login(username, password)
  await page.waitForURL('/dashboard')
}

// Register + Login helper — สำหรับ test ที่ต้องการ user ใหม่
export async function registerAndLogin(page: Page, suffix = '') {
  const registerPage = new RegisterPage(page)
  await registerPage.goto()
  await registerPage.register({
    username:  `${TEST_USER.username}${suffix}`,
    email:     `playwright${suffix}@test.com`,
    password:  TEST_USER.password,
    firstName: TEST_USER.firstName,
    lastName:  TEST_USER.lastName,
  })
  await page.waitForURL('/dashboard')
}
