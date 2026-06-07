# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: pricepulse.spec.ts >> PricePulse End-to-End Journey >> User can register, login, and track a product
- Location: e2e\pricepulse.spec.ts:13:3

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('table')
Expected substring: "https://example.com/test-1780856490691"
Received string:    "Produit (URL)Prix InitialPrix ActuelTendanceActionsexample.com/test-1780856490691100.00 €100.00 € 0.00%"
Timeout: 15000ms

Call log:
  - Expect "toContainText" with timeout 15000ms
  - waiting for locator('table')
    27 × locator resolved to <table class="min-w-full divide-y divide-slate-200">…</table>
       - unexpected value "Produit (URL)Prix InitialPrix ActuelTendanceActionsexample.com/test-1780856490691100.00 €100.00 € 0.00%"

```

```yaml
- table:
  - rowgroup:
    - row "Produit (URL) Prix Initial Prix Actuel Tendance Actions":
      - columnheader "Produit (URL)"
      - columnheader "Prix Initial"
      - columnheader "Prix Actuel"
      - columnheader "Tendance"
      - columnheader "Actions"
  - rowgroup:
    - row "example.com/test-1780856490691 100.00 € 100.00 € 0.00%":
      - cell "example.com/test-1780856490691":
        - link "example.com/test-1780856490691":
          - /url: https://example.com/test-1780856490691
      - cell "100.00 €"
      - cell "100.00 €"
      - cell "0.00%"
      - cell:
        - button "Supprimer"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('PricePulse End-to-End Journey', () => {
  4  |   test.slow(); 
  5  | 
  6  |   test.beforeEach(async ({ page }) => {
  7  |     console.log('--- Starting Test Case ---');
  8  |     await page.goto('/');
  9  |     await page.evaluate(() => localStorage.clear());
  10 |     await page.reload();
  11 |   });
  12 | 
  13 |   test('User can register, login, and track a product', async ({ page }) => {
  14 |     const testEmail = `user-${Date.now()}@test.com`;
  15 |     const testName = `E2E Tester ${Date.now()}`;
  16 |     console.log(`Using email: ${testEmail}`);
  17 | 
  18 |     // 1. Switch to Register
  19 |     console.log('Navigating to register mode...');
  20 |     await page.getByRole('button', { name: /Don't have an account/i }).click();
  21 |     
  22 |     // 2. Fill Register Form
  23 |     await page.getByPlaceholder(/Full Name/i).fill(testName);
  24 |     await page.getByPlaceholder(/Email Address/i).fill(testEmail);
  25 |     await page.getByPlaceholder(/Password/i).fill('password123');
  26 |     
  27 |     // 3. Click Submit
  28 |     console.log('Clicking Sign Up...');
  29 |     await page.locator('button[type="submit"]').click();
  30 | 
  31 |     // 4. Wait for Dashboard
  32 |     console.log('Waiting for dashboard...');
  33 |     // If it fails, check if an error toast appeared
  34 |     try {
  35 |         await expect(page.getByText(/Tracked Products/i)).toBeVisible({ timeout: 30000 });
  36 |         console.log('Dashboard visible!');
  37 |     } catch (e) {
  38 |         console.log('Dashboard not found. Checking for error messages...');
  39 |         const errorText = await page.locator('div[role="status"]').innerText().catch(() => 'No toast error found');
  40 |         console.log(`Site Error: ${errorText}`);
  41 |         throw e;
  42 |     }
  43 | 
  44 |     // 5. Add product
  45 |     console.log('Adding a product...');
  46 |     const productUrl = `https://example.com/test-${Date.now()}`;
  47 |     await page.getByPlaceholder(/URL du produit/i).fill(productUrl);
  48 |     await page.getByPlaceholder(/Prix initial/i).fill('100');
  49 |     await page.locator('button:has-text("Ajouter")').first().click();
  50 | 
> 51 |     await expect(page.locator('table')).toContainText(productUrl, { timeout: 15000 });
     |                                         ^ Error: expect(locator).toContainText(expected) failed
  52 |     console.log('Product added successfully!');
  53 | 
  54 |     // 6. Logout
  55 |     console.log('Logging out...');
  56 |     await page.locator('button[title="Logout"]').click();
  57 |     await expect(page.getByText(/Sign In to PricePulse/i)).toBeVisible();
  58 |     console.log('Test successful!');
  59 |   });
  60 | 
  61 |   test('Should reject invalid URL submission', async ({ page }) => {
  62 |     console.log('Testing invalid URL rejection...');
  63 |     // Use the seed user
  64 |     await page.getByPlaceholder(/Email Address/i).fill('default@user.com');
  65 |     await page.getByPlaceholder(/Password/i).fill('password123');
  66 |     await page.locator('button[type="submit"]').click();
  67 | 
  68 |     await expect(page.getByText(/Tracked Products/i)).toBeVisible({ timeout: 20000 });
  69 | 
  70 |     await page.getByPlaceholder(/URL du produit/i).fill('invalid-link');
  71 |     await page.getByPlaceholder(/Prix initial/i).fill('10');
  72 |     await page.locator('button:has-text("Ajouter")').first().click();
  73 | 
  74 |     await expect(page.locator('div[role="status"]')).toBeVisible();
  75 |     console.log('Invalid URL rejected correctly.');
  76 |   });
  77 | });
  78 | 
```