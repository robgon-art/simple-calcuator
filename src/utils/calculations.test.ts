import { describe, it, expect } from 'vitest';
import {
    add,
    subtract,
    multiply,
    divide,
    percentage,
    negate,
    squareRoot,
    createInitialState,
    appendDigit,
    clear,
    clearEntry,
    calculateResult,
    setOperation,
    memoryStore,
    memoryRecall,
    memoryAdd,
    memorySubtract,
    memoryClear,
    CalculatorState
} from './calculations';

// Test basic arithmetic operations
describe('add()', () => {
    it('should return the sum of two positive numbers', () => {
        expect(add(2, 3)).toBe(5);
    });

    it('should return the sum of a positive and negative number', () => {
        expect(add(5, -3)).toBe(2);
    });

    it('should return the sum of decimal numbers', () => {
        expect(add(0.1, 0.2)).toBeCloseTo(0.3);
    });
});

describe('subtract()', () => {
    it('should return the difference of two numbers', () => {
        expect(subtract(5, 3)).toBe(2);
    });

    it('should return a negative result when subtracting a larger number from a smaller one', () => {
        expect(subtract(3, 5)).toBe(-2);
    });
});

describe('multiply()', () => {
    it('should return the product of two positive numbers', () => {
        expect(multiply(4, 3)).toBe(12);
    });

    it('should return a negative product for a positive and negative number', () => {
        expect(multiply(4, -3)).toBe(-12);
    });

    it('should return a positive product for two negative numbers', () => {
        expect(multiply(-4, -3)).toBe(12);
    });
});

describe('divide()', () => {
    it('should return the quotient of two numbers', () => {
        expect(divide(6, 3)).toBe(2);
    });

    it('should return a decimal quotient when appropriate', () => {
        expect(divide(5, 2)).toBe(2.5);
    });

    it('should throw an error when dividing by zero', () => {
        expect(() => divide(5, 0)).toThrow('Division by zero');
    });
});

describe('percentage()', () => {
    it('should return the percentage value of a number', () => {
        expect(percentage(50)).toBe(0.5);
    });

    it('should return zero for percentage of zero', () => {
        expect(percentage(0)).toBe(0);
    });
});

describe('negate()', () => {
    it('should return the negative value of a positive number', () => {
        expect(negate(5)).toBe(-5);
    });

    it('should return the positive value of a negative number', () => {
        expect(negate(-5)).toBe(5);
    });

    it('should return zero when negating zero', () => {
        expect(negate(0)).toBe(0);
    });
});

describe('squareRoot()', () => {
    it('should return the square root of a positive number', () => {
        expect(squareRoot(9)).toBe(3);
    });

    it('should return zero for the square root of zero', () => {
        expect(squareRoot(0)).toBe(0);
    });

    it('should throw an error for the square root of a negative number', () => {
        expect(() => squareRoot(-1)).toThrow('Cannot calculate square root of negative number');
    });
});

// Test calculator state transformations
describe('createInitialState()', () => {
    it('should return the initial calculator state', () => {
        expect(createInitialState()).toEqual({
            displayValue: '0',
            previousValue: null,
            operation: null,
            resetDisplay: false,
            memory: 0
        });
    });
});

describe('appendDigit()', () => {
    const initialState = createInitialState();

    it('should replace zero with digit when in initial state', () => {
        expect(appendDigit(initialState, '5').displayValue).toBe('5');
    });

    it('should append decimal to zero in initial state', () => {
        expect(appendDigit(initialState, '.').displayValue).toBe('0.');
    });

    it('should append digit to non-zero display', () => {
        const nonZeroState: CalculatorState = {
            ...initialState,
            displayValue: '5'
        };
        expect(appendDigit(nonZeroState, '3').displayValue).toBe('53');
    });

    it('should not append a second decimal point', () => {
        const decimalState: CalculatorState = {
            ...initialState,
            displayValue: '5.2'
        };
        expect(appendDigit(decimalState, '.').displayValue).toBe('5.2');
    });

    it('should replace display with digit and reset flag when resetDisplay is true', () => {
        const resetState: CalculatorState = {
            ...initialState,
            displayValue: '5',
            resetDisplay: true
        };

        const result = appendDigit(resetState, '9');
        expect(result).toEqual({
            ...resetState,
            displayValue: '9',
            resetDisplay: false
        });
    });
});

describe('clear()', () => {
    it('should return to initial state', () => {
        expect(clear()).toEqual(createInitialState());
    });
});

describe('clearEntry()', () => {
    it('should only clear display value', () => {
        const modifiedState: CalculatorState = {
            displayValue: '123',
            previousValue: 456,
            operation: '+',
            resetDisplay: true,
            memory: 789
        };

        expect(clearEntry(modifiedState)).toEqual({
            ...modifiedState,
            displayValue: '0'
        });
    });
});

describe('calculateResult()', () => {
    it('should calculate sum and update state for addition operation', () => {
        const additionState: CalculatorState = {
            displayValue: '5',
            previousValue: 3,
            operation: '+',
            resetDisplay: false,
            memory: 0
        };

        expect(calculateResult(additionState)).toEqual({
            ...additionState,
            displayValue: '8',
            previousValue: null,
            operation: null,
            resetDisplay: true
        });
    });

    it('should handle division by zero error gracefully', () => {
        const divByZeroState: CalculatorState = {
            displayValue: '0',
            previousValue: 5,
            operation: '/',
            resetDisplay: false,
            memory: 0
        };

        expect(calculateResult(divByZeroState)).toEqual({
            ...divByZeroState,
            displayValue: 'Division by zero',
            previousValue: null,
            operation: null,
            resetDisplay: true
        });
    });

    it('should return unchanged state for incomplete operation', () => {
        const incompleteState: CalculatorState = {
            displayValue: '5',
            previousValue: null,
            operation: null,
            resetDisplay: false,
            memory: 0
        };

        expect(calculateResult(incompleteState)).toEqual(incompleteState);
    });
});

describe('setOperation()', () => {
    it('should set operation and update state from initial state', () => {
        const initialState = createInitialState();
        initialState.displayValue = '5';

        expect(setOperation(initialState, '+')).toEqual({
            ...initialState,
            previousValue: 5,
            operation: '+',
            resetDisplay: true
        });
    });

    it('should calculate first operation and set new one for chained operations', () => {
        const pendingOpState: CalculatorState = {
            displayValue: '5',
            previousValue: 10,
            operation: '+',
            resetDisplay: false,
            memory: 0
        };

        const resultState = setOperation(pendingOpState, '-');

        expect(resultState.displayValue).toBe('15');
        expect(resultState.operation).toBe('-');
    });
});

// Test memory operations
describe('memoryStore()', () => {
    it('should store display value in memory', () => {
        const initialState: CalculatorState = {
            ...createInitialState(),
            displayValue: '42'
        };

        expect(memoryStore(initialState)).toEqual({
            ...initialState,
            memory: 42
        });
    });
});

describe('memoryRecall()', () => {
    it('should recall memory to display', () => {
        const stateWithMemory: CalculatorState = {
            ...createInitialState(),
            displayValue: '5',
            memory: 42
        };

        expect(memoryRecall(stateWithMemory)).toEqual({
            ...stateWithMemory,
            displayValue: '42',
            resetDisplay: true
        });
    });
});

describe('memoryAdd()', () => {
    it('should add display to memory', () => {
        const stateWithMemory: CalculatorState = {
            ...createInitialState(),
            displayValue: '8',
            memory: 12
        };

        expect(memoryAdd(stateWithMemory)).toEqual({
            ...stateWithMemory,
            memory: 20
        });
    });
});

describe('memorySubtract()', () => {
    it('should subtract display from memory', () => {
        const stateWithMemory: CalculatorState = {
            ...createInitialState(),
            displayValue: '7',
            memory: 15
        };

        expect(memorySubtract(stateWithMemory)).toEqual({
            ...stateWithMemory,
            memory: 8
        });
    });
});

describe('memoryClear()', () => {
    it('should clear memory to zero', () => {
        const stateWithMemory: CalculatorState = {
            ...createInitialState(),
            memory: 42
        };

        expect(memoryClear(stateWithMemory)).toEqual({
            ...stateWithMemory,
            memory: 0
        });
    });
}); 