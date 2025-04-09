import { Page, Locator } from '@playwright/test';

export class CalculatorPage {
    readonly page: Page;
    readonly display: Locator;

    constructor(page: Page) {
        this.page = page;
        this.display = page.locator('[data-testid="calculator-input"]');
    }

    async goto() {
        await this.page.goto('/');
        await this.page.waitForLoadState('networkidle');

        console.log("Page URL after navigation:", this.page.url());

        await this.page.waitForTimeout(1000);
    }

    async pressDigit(digit: string) {
        await this.page.locator(`button:has-text("${digit}")`).click();
    }

    async pressOperation(operation: '+' | '-' | '*' | '/') {
        await this.page.locator(`button:has-text("${operation}")`).click();
    }

    async pressEquals() {
        await this.page.locator('button:has-text("=")').click();
    }

    async pressClear() {
        await this.page.locator('button:has-text("C")').click();
    }

    async getDisplayValue() {
        await this.page.waitForTimeout(100);

        try {
            const text = await this.display.textContent();
            console.log("Display content:", text);
            return text || "";
        } catch (e) {
            console.error("Error getting display value:", e);
            return "Error getting display";
        }
    }

    async performCalculation(num1: string, operation: '+' | '-' | '*' | '/', num2: string) {
        for (const digit of num1) {
            await this.pressDigit(digit);
        }

        await this.pressOperation(operation);

        for (const digit of num2) {
            await this.pressDigit(digit);
        }

        await this.pressEquals();

        return this.getDisplayValue();
    }
} 