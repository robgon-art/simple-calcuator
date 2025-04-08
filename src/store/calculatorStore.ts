import { makeAutoObservable } from 'mobx';
import {
    add,
    subtract,
    multiply,
    divide,
    appendDigit as appendDigitFn,
    CalculatorState
} from '../utils/calculations';

export type OperationType = '+' | '-' | '*' | '/' | '=' | null;

export interface CalculationHistoryItem {
    expression: string;
    result: string;
    timestamp: number;
}

export class CalculatorStore {
    // Current display value
    currentValue: string = '0';

    // Previous value (used when performing operations)
    previousValue: string = '0';

    // Current operation
    currentOperation: OperationType = null;

    // Flag to indicate if we should clear the display on next number input
    shouldClearDisplay: boolean = false;

    // Calculation history
    history: CalculationHistoryItem[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    // Add a digit to the current value
    appendDigit(digit: string) {
        // Create a state object matching the CalculatorState interface
        const stateObj: CalculatorState = {
            displayValue: this.currentValue,
            previousValue: parseFloat(this.previousValue),
            operation: this.currentOperation,
            resetDisplay: this.shouldClearDisplay,
            memory: 0 // Not used in this context
        };

        // Use the pure function to calculate the new state
        const newState = appendDigitFn(stateObj, digit);

        // Update the store with the new state
        this.currentValue = newState.displayValue;
        this.shouldClearDisplay = newState.resetDisplay;
    }

    // Set the operation to perform
    setOperation(operation: OperationType) {
        if (this.currentOperation && this.currentOperation !== '=' && !this.shouldClearDisplay) {
            // If an operation is already set, perform the calculation first
            this.calculateResult();
        }

        this.previousValue = this.currentValue;
        this.currentOperation = operation;
        this.shouldClearDisplay = true;
    }

    // Calculate the result of the current operation
    calculateResult() {
        if (!this.currentOperation || this.currentOperation === '=') {
            return;
        }

        const prev = parseFloat(this.previousValue);
        const curr = parseFloat(this.currentValue);

        let result: number;

        try {
            switch (this.currentOperation) {
                case '+':
                    result = add(prev, curr);
                    break;
                case '-':
                    result = subtract(prev, curr);
                    break;
                case '*':
                    result = multiply(prev, curr);
                    break;
                case '/':
                    result = divide(prev, curr);
                    break;
                default:
                    return;
            }

            // Format the result to avoid floating point issues
            const resultStr = Number.isInteger(result) ? result.toString() : result.toFixed(10).replace(/\.?0+$/, '');

            const expression = `${this.previousValue} ${this.currentOperation} ${this.currentValue}`;
            console.log('Adding to history:', expression, resultStr);

            // Add to history
            this.addToHistory(expression, resultStr);

            this.currentValue = resultStr;
            this.currentOperation = null;
            this.shouldClearDisplay = true;
        } catch (error) {
            this.currentValue = error instanceof Error ? error.message : 'Error';
            this.currentOperation = null;
            this.shouldClearDisplay = true;
        }
    }

    // Add an entry to calculation history
    addToHistory(expression: string, result: string) {
        const historyItem = {
            expression,
            result,
            timestamp: Date.now()
        };

        this.history.push(historyItem);
        console.log('History after adding item:', this.history);
    }

    // Clear the current value
    clearEntry() {
        this.currentValue = '0';
    }

    // Reset the calculator
    clearAll() {
        this.currentValue = '0';
        this.previousValue = '0';
        this.currentOperation = null;
        this.shouldClearDisplay = false;
    }

    // Clear the history
    clearHistory() {
        this.history = [];
        console.log('History cleared');
    }
}

// Create and export a singleton instance
export const calculatorStore = new CalculatorStore(); 