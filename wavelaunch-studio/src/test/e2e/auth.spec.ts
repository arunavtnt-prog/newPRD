/**
 * Authentication E2E Tests
 */

import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/auth\/v2\/login/);
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/auth/v2/login');

    // Fill login form
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'Test123!@#');

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');

    // Should show user menu
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/auth/v2/login');

    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'wrongpassword');

    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.locator('text=/Invalid credentials/i')).toBeVisible();

    // Should stay on login page
    await expect(page).toHaveURL(/\/auth\/v2\/login/);
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/auth/v2/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'Test123!@#');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/dashboard');

    // Click user menu
    await page.click('[data-testid="user-menu"]');

    // Click logout
    await page.click('text=/Sign out/i');

    // Should redirect to login
    await expect(page).toHaveURL(/\/auth\/v2\/login/);
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/auth/v2/login');

    await page.fill('[name="email"]', 'invalidemail');
    await page.fill('[name="password"]', 'Test123!@#');

    await page.click('button[type="submit"]');

    // Should show validation error
    await expect(
      page.locator('text=/valid email/i')
    ).toBeVisible();
  });

  test('should require password', async ({ page }) => {
    await page.goto('/auth/v2/login');

    await page.fill('[name="email"]', 'test@example.com');
    // Leave password empty

    await page.click('button[type="submit"]');

    // Should show validation error
    await expect(
      page.locator('text=/required/i')
    ).toBeVisible();
  });
});
