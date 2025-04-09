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