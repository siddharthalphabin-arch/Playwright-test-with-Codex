import { test, expect } from '@playwright/test';

import { LoginPage } from '../pages/login.page';

const validEmail = process.env.STOREDEMO_VALID_EMAIL ?? 'customer@testdino.com';
const validPassword = process.env.STOREDEMO_VALID_PASSWORD ?? 'Password123!';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.expectOnLoginPage();
  });

  test('logs in successfully with valid credentials and redirects to the dashboard', async ({ page }) => {
    await loginPage.login(validEmail, validPassword);

    await expect(page).toHaveURL(/\/dashboard\/?$/);
  });

  test('shows an invalid credentials error when the password is incorrect', async () => {
    await loginPage.login(validEmail, 'wrong-password');

    await expect(loginPage.errorMessage('Invalid credentials')).toBeVisible();
    await loginPage.expectOnLoginPage();
  });

  test('shows required validation messages when email and password are empty', async () => {
    await loginPage.submitButton.click();

    await expect.soft(loginPage.errorMessage(/email.*required|required.*email/i)).toBeVisible();
    await expect.soft(loginPage.errorMessage(/password.*required|required.*password/i)).toBeVisible();

    await expect.poll(() => loginPage.validationMessage('email')).toMatch(/.+/);
    await expect.poll(() => loginPage.validationMessage('password')).toMatch(/.+/);
  });
});
