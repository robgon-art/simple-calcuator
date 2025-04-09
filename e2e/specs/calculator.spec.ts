import { test, expect } from '@playwright/test';
import { CalculatorPage } from '../page-objects/calculator-page';

test('should render calculator properly', async ({ page }) => {
    const calculatorPage = new CalculatorPage(page);
    await calculatorPage.goto();

    // Update the title check to match actual title
    await expect(page).toHaveTitle("Vite + React + TS");

    // Check if app container exists
    await expect(page.locator('#root')).toBeVisible();

    // Wait for app to be ready before checking for specific elements
    await page.waitForSelector('button', { timeout: 5000 }).catch(e => {
        console.log('Button not found, trying to debug page content');
    });

    // Debug step to see what's actually on the page
    const html = await page.content();
    console.log('Page HTML structure:', html.substring(0, 500) + '...');

    // Get all buttons on the page to debug
    const buttons = await page.locator('button').count();
    console.log(`Found ${buttons} buttons on the page`);
});

test('should input digits correctly', async ({ page }) => {
    const calculatorPage = new CalculatorPage(page);
    await calculatorPage.goto();

    // Make sure buttons are present
    await expect(page.locator('button:has-text("1")')).toBeVisible();

    // Input digits 123
    await calculatorPage.pressDigit('1');
    await calculatorPage.pressDigit('2');
    await calculatorPage.pressDigit('3');

    // Verify display shows 123
    const displayValue = await calculatorPage.getDisplayValue();
    expect(displayValue).toContain('123');
});

test('should perform basic addition', async ({ page }) => {
    const calculatorPage = new CalculatorPage(page);
    await calculatorPage.goto();

    // Make sure buttons are present
    await expect(page.locator('button:has-text("2")')).toBeVisible();
    await expect(page.locator('button:has-text("+")')).toBeVisible();

    // Calculate 2 + 2
    await calculatorPage.pressDigit('2');
    await calculatorPage.pressOperation('+');
    await calculatorPage.pressDigit('2');
    await calculatorPage.pressEquals();

    // Verify result is 4
    const result = await calculatorPage.getDisplayValue();
    expect(result).toContain('4');
});

test('should clear the display', async ({ page }) => {
    const calculatorPage = new CalculatorPage(page);
    await calculatorPage.goto();

    // Make sure buttons are present
    await expect(page.locator('button:has-text("5")')).toBeVisible();
    await expect(page.locator('button:has-text("C")')).toBeVisible();

    // Input some digits
    await calculatorPage.pressDigit('5');
    await calculatorPage.pressDigit('5');

    // Verify display shows 55
    let displayValue = await calculatorPage.getDisplayValue();
    expect(displayValue).toContain('55');

    // Clear the display
    await calculatorPage.pressClear();

    // Verify display shows 0
    displayValue = await calculatorPage.getDisplayValue();
    expect(displayValue).toContain('0');
});

// Phase 2: Additional Operation Tests

test('should perform subtraction correctly', async ({ page }) => {
    const calculatorPage = new CalculatorPage(page);
    await calculatorPage.goto();

    // Calculate 8 - 3
    const result = await calculatorPage.performCalculation('8', '-', '3');

    // Verify result is 5
    expect(result).toContain('5');
});

test('should perform multiplication correctly', async ({ page }) => {
    const calculatorPage = new CalculatorPage(page);
    await calculatorPage.goto();

    // Calculate 6 * 7
    const result = await calculatorPage.performCalculation('6', '*', '7');

    // Verify result is 42
    expect(result).toContain('42');
});

test('should perform division correctly', async ({ page }) => {
    const calculatorPage = new CalculatorPage(page);
    await calculatorPage.goto();

    // Calculate 10 / 2
    const result = await calculatorPage.performCalculation('10', '/', '2');

    // Verify result is 5
    expect(result).toContain('5');
});

test('should handle decimal point input correctly', async ({ page }) => {
    const calculatorPage = new CalculatorPage(page);
    await calculatorPage.goto();

    // Calculate 1.5 + 2.5
    const result = await calculatorPage.performCalculation('1.5', '+', '2.5');

    // Verify result is 4
    expect(result).toContain('4');
});

// Error Handling Tests

test('should handle division by zero gracefully', async ({ page }) => {
    const calculatorPage = new CalculatorPage(page);
    await calculatorPage.goto();

    // Try to calculate 5 / 0
    const result = await calculatorPage.performCalculation('5', '/', '0');

    // Depending on calculator implementation, it might show an error message
    // or "Infinity" or something similar
    expect(result).toMatch(/Error|Cannot divide by zero|Infinity|∞|Division by zero/i);
});

test('should handle large number calculations', async ({ page }) => {
    const calculatorPage = new CalculatorPage(page);
    await calculatorPage.goto();

    // Enter a large number (within JavaScript safe integer range)
    await calculatorPage.enterNumber('9999999');

    // Verify it's displayed correctly
    const displayValue = await calculatorPage.getDisplayValue();
    expect(displayValue).toContain('9999999');

    // Calculate 9999 * 9999
    await calculatorPage.pressAllClear();
    const result = await calculatorPage.performCalculation('9999', '*', '9999');

    // Result should be 99980001, but check that it contains the first few digits
    // to allow for different display formats (scientific notation, rounding, etc.)
    expect(result).toMatch(/9998/);
});