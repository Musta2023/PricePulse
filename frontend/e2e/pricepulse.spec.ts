import { test, expect } from '@playwright/test';

test.describe('PricePulse End-to-End Journey', () => {
  test.slow(); 

  test.beforeEach(async ({ page }) => {
    console.log('--- Starting Test Case ---');
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('User can register, login, and track a product', async ({ page }) => {
    const testEmail = `user-${Date.now()}@test.com`;
    const testName = `E2E Tester ${Date.now()}`;
    console.log(`Using email: ${testEmail}`);

    // 1. Switch to Register
    console.log('Navigating to register mode...');
    await page.getByRole('button', { name: /Don't have an account/i }).click();
    
    // 2. Fill Register Form
    await page.getByPlaceholder(/Full Name/i).fill(testName);
    await page.getByPlaceholder(/Email Address/i).fill(testEmail);
    await page.getByPlaceholder(/Password/i).fill('password123');
    
    // 3. Click Submit
    console.log('Clicking Sign Up...');
    await page.locator('button[type="submit"]').click();

    // 4. Wait for Dashboard
    console.log('Waiting for dashboard...');
    // If it fails, check if an error toast appeared
    try {
        await expect(page.getByText(/Tracked Products/i)).toBeVisible({ timeout: 30000 });
        console.log('Dashboard visible!');
    } catch (e) {
        console.log('Dashboard not found. Checking for error messages...');
        const errorText = await page.locator('div[role="status"]').innerText().catch(() => 'No toast error found');
        console.log(`Site Error: ${errorText}`);
        throw e;
    }

    // 5. Add product
    console.log('Adding a product...');
    const productUrl = `https://example.com/test-${Date.now()}`;
    await page.getByPlaceholder(/URL du produit/i).fill(productUrl);
    await page.getByPlaceholder(/Prix initial/i).fill('100');
    await page.locator('button:has-text("Ajouter")').first().click();

    await expect(page.locator('table')).toContainText(productUrl, { timeout: 15000 });
    console.log('Product added successfully!');

    // 6. Logout
    console.log('Logging out...');
    await page.locator('button[title="Logout"]').click();
    await expect(page.getByText(/Sign In to PricePulse/i)).toBeVisible();
    console.log('Test successful!');
  });

  test('Should reject invalid URL submission', async ({ page }) => {
    console.log('Testing invalid URL rejection...');
    // Use the seed user
    await page.getByPlaceholder(/Email Address/i).fill('default@user.com');
    await page.getByPlaceholder(/Password/i).fill('password123');
    await page.locator('button[type="submit"]').click();

    await expect(page.getByText(/Tracked Products/i)).toBeVisible({ timeout: 20000 });

    await page.getByPlaceholder(/URL du produit/i).fill('invalid-link');
    await page.getByPlaceholder(/Prix initial/i).fill('10');
    await page.locator('button:has-text("Ajouter")').first().click();

    await expect(page.locator('div[role="status"]')).toBeVisible();
    console.log('Invalid URL rejected correctly.');
  });
});
