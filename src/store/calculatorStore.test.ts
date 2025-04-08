import { describe, it, expect, beforeEach } from 'vitest';
import { CalculatorStore } from './calculatorStore';

// Integration test - no mocks, testing the actual components together
describe('CalculatorStore Integration', () => {
    let store: CalculatorStore;

    beforeEach(() => {
        store = new CalculatorStore();
    });

    describe('initial state', () => {
        it('starts with default values', () => {
            expect(store.currentValue).toBe('0');
            expect(store.previousValue).toBe('0');
            expect(store.currentOperation).toBeNull();
            expect(store.shouldClearDisplay).toBe(false);
            expect(store.history).toEqual([]);
        });
    });

    describe('appendDigit', () => {
        it('replaces 0 with the digit', () => {
            store.appendDigit('5');
            expect(store.currentValue).toBe('5');
        });

        it('appends digits', () => {
            store.appendDigit('1');
            store.appendDigit('2');
            store.appendDigit('3');
            expect(store.currentValue).toBe('123');
        });

        it('handles decimal points', () => {
            store.appendDigit('1');
            store.appendDigit('.');
            store.appendDigit('5');
            expect(store.currentValue).toBe('1.5');
        });

        it('prevents multiple decimal points', () => {
            store.appendDigit('1');
            store.appendDigit('.');
            store.appendDigit('5');
            store.appendDigit('.');
            store.appendDigit('2');
            expect(store.currentValue).toBe('1.52');
        });

        it('clears display when shouldClearDisplay is true', () => {
            store.currentValue = '123';
            store.shouldClearDisplay = true;
            store.appendDigit('5');
            expect(store.currentValue).toBe('5');
            expect(store.shouldClearDisplay).toBe(false);
        });
    });

    describe('setOperation', () => {
        it('sets the operation and prepares for new input', () => {
            store.currentValue = '10';
            store.setOperation('+');
            expect(store.previousValue).toBe('10');
            expect(store.currentOperation).toBe('+');
            expect(store.shouldClearDisplay).toBe(true);
        });

        it('calculates intermediate result when chaining operations', () => {
            store.currentValue = '5';
            store.setOperation('+');
            store.appendDigit('3');
            store.setOperation('*');
            expect(store.previousValue).toBe('8'); // 5 + 3 = 8
            expect(store.currentOperation).toBe('*');
        });
    });

    describe('calculateResult', () => {
        it('performs addition correctly', () => {
            store.currentValue = '5';
            store.setOperation('+');
            store.currentValue = '3';
            store.calculateResult();
            expect(store.currentValue).toBe('8');
        });

        it('performs subtraction correctly', () => {
            store.currentValue = '10';
            store.setOperation('-');
            store.currentValue = '4';
            store.calculateResult();
            expect(store.currentValue).toBe('6');
        });

        it('performs multiplication correctly', () => {
            store.currentValue = '6';
            store.setOperation('*');
            store.currentValue = '7';
            store.calculateResult();
            expect(store.currentValue).toBe('42');
        });

        it('performs division correctly', () => {
            store.currentValue = '15';
            store.setOperation('/');
            store.currentValue = '3';
            store.calculateResult();
            expect(store.currentValue).toBe('5');
        });

        it('handles division by zero', () => {
            store.currentValue = '10';
            store.setOperation('/');
            store.currentValue = '0';
            store.calculateResult();
            expect(store.currentValue).toBe('Division by zero');
        });

        it('formats decimal results correctly', () => {
            store.currentValue = '10';
            store.setOperation('/');
            store.currentValue = '3';
            store.calculateResult();
            expect(store.currentValue).toBe('3.3333333333');
        });

        it('adds to history when calculation is performed', () => {
            store.currentValue = '7';
            store.setOperation('+');
            store.currentValue = '3';
            store.calculateResult();
            expect(store.history).toHaveLength(1);
            expect(store.history[0]).toMatchObject({
                expression: '7 + 3',
                result: '10'
            });
            expect(store.history[0]).toHaveProperty('timestamp');
        });
    });

    describe('clearEntry', () => {
        it('resets current value to 0', () => {
            store.currentValue = '123';
            store.clearEntry();
            expect(store.currentValue).toBe('0');
        });
    });

    describe('clearAll', () => {
        it('resets calculator to initial state', () => {
            store.currentValue = '123';
            store.previousValue = '456';
            store.currentOperation = '+';
            store.shouldClearDisplay = true;
            store.clearAll();
            expect(store.currentValue).toBe('0');
            expect(store.previousValue).toBe('0');
            expect(store.currentOperation).toBeNull();
            expect(store.shouldClearDisplay).toBe(false);
        });
    });

    describe('clearHistory', () => {
        it('clears calculation history', () => {
            store.addToHistory('5 + 3', '8');
            expect(store.history).toHaveLength(1);
            store.clearHistory();
            expect(store.history).toEqual([]);
        });
    });
}); 