import { Page, Locator } from '@playwright/test';

interface HistoryEntry {
    expression: string | null;
    result: string | null;
}

export class CalculatorPage {
    readonly page: Page;
    readonly display: Locator;
    readonly historyContainer: Locator;

    constructor(page: Page) {
        this.page = page;
        this.display = page.locator('[data-testid="calculator-input"]');
        this.historyContainer = page.locator('[data-testid="calculator-history"]');
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

    async pressDecimalPoint() {
        await this.page.locator('button:has-text(".")').click();
    }

    async pressOperation(operation: '+' | '-' | '*' | '/') {
        // Map programming operators to their UI equivalents
        const operationMap = {
            '+': '+',
            '-': '-',
            '*': '×', // Using the multiplication symbol
            '/': '÷'  // Using the division symbol
        };

        const uiOperation = operationMap[operation];
        console.log(`Looking for operation button: ${uiOperation}`);

        try {
            await this.page.locator(`button:has-text("${uiOperation}")`).click();
        } catch (e) {
            console.error(`Failed to click ${uiOperation}, trying alternate symbols`);

            // Try alternative symbols as fallback
            if (operation === '*') {
                await this.page.locator('button:has-text("*"), button:has-text("x"), button:has-text("X")').first().click();
            } else if (operation === '/') {
                await this.page.locator('button:has-text("/"), button:has-text("\\")').first().click();
            } else {
                throw e; // Re-throw for other operations
            }
        }
    }

    async pressEquals() {
        await this.page.locator('button:has-text("=")').click();
    }

    async pressClear() {
        await this.page.locator('button:has-text("C")').click();
    }

    async pressAllClear() {
        const acButton = this.page.locator('button:has-text("AC"), button:has-text("CA"), button:has-text("CE")');
        if (await acButton.count() > 0) {
            await acButton.click();
        } else {
            await this.pressClear();
            await this.pressClear();
        }
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

    async enterNumber(number: string) {
        for (const char of number) {
            if (char === '.') {
                await this.pressDecimalPoint();
            } else {
                await this.pressDigit(char);
            }
        }
    }

    async performCalculation(num1: string, operation: '+' | '-' | '*' | '/', num2: string) {
        await this.enterNumber(num1);

        await this.pressOperation(operation);

        await this.enterNumber(num2);

        await this.pressEquals();

        return this.getDisplayValue();
    }

    // History methods
    async isHistoryVisible() {
        const isVisible = await this.historyContainer.isVisible();
        return isVisible;
    }

    async getHistoryEntries(): Promise<HistoryEntry[]> {
        // Wait for history to update
        await this.page.waitForTimeout(500);

        // Check if history list exists
        const historyList = this.page.locator('.history-list');
        if (!(await historyList.isVisible())) {
            console.log("History list not visible");
            return [];
        }

        // Get all history items
        const historyItems = this.page.locator('.history-item');
        const count = await historyItems.count();
        console.log(`Found ${count} history items`);

        const entries: HistoryEntry[] = [];
        for (let i = 0; i < count; i++) {
            const expression = await historyItems.nth(i).locator('.history-expression').textContent();
            const result = await historyItems.nth(i).locator('.history-result').textContent();
            entries.push({ expression, result });
        }

        return entries;
    }

    async checkHistoryContains(expression: string, result: string) {
        const entries = await this.getHistoryEntries();

        // Find matching entry
        return entries.some(entry =>
            entry.expression?.includes(expression) &&
            entry.result?.includes(result));
    }

    // Keyboard navigation methods
    async pressKeyboardDigit(digit: string) {
        await this.page.keyboard.press(digit);
    }

    async pressKeyboardDecimalPoint() {
        await this.page.keyboard.press('.');
    }

    async pressKeyboardOperation(operation: '+' | '-' | '*' | '/') {
        // For multiplication, we need to use Shift+8 on most keyboards
        if (operation === '*') {
            await this.page.keyboard.press('*');
        } else {
            await this.page.keyboard.press(operation);
        }
    }

    async pressKeyboardEquals() {
        await this.page.keyboard.press('Enter');
    }

    async pressKeyboardClear() {
        await this.page.keyboard.press('Escape');
    }

    async performKeyboardCalculation(num1: string, operation: '+' | '-' | '*' | '/', num2: string) {
        // Input first number via keyboard
        for (const char of num1) {
            if (char === '.') {
                await this.pressKeyboardDecimalPoint();
            } else {
                await this.pressKeyboardDigit(char);
            }
        }

        // Press operation
        await this.pressKeyboardOperation(operation);

        // Input second number
        for (const char of num2) {
            if (char === '.') {
                await this.pressKeyboardDecimalPoint();
            } else {
                await this.pressKeyboardDigit(char);
            }
        }

        // Press Enter for equals
        await this.pressKeyboardEquals();

        return this.getDisplayValue();
    }
} 