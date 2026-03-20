import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page
      .getByLabel(/email/i)
      .or(page.getByPlaceholder(/email/i))
      .or(page.getByRole('textbox', { name: /email/i }));
    this.passwordInput = page
      .getByLabel(/password/i)
      .or(page.getByPlaceholder(/password/i))
      .or(page.getByRole('textbox', { name: /password/i }));
    this.submitButton = page
      .getByRole('button', { name: /log\s*in|sign\s*in/i })
      .or(page.getByTestId('login-submit'));
  }

  async goto() {
    await this.page.goto('https://storedemo.testdino.com/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  errorMessage(message: string | RegExp) {
    return this.page.getByText(message, { exact: typeof message === 'string' });
  }

  validationMessage(field: 'email' | 'password') {
    const input = field === 'email' ? this.emailInput : this.passwordInput;
    return input.evaluate((element: HTMLInputElement) => element.validationMessage);
  }

  async expectOnLoginPage() {
    await expect(this.page).toHaveURL(/\/login\/?$/);
  }
}
