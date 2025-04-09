/**
 * Calculator operations implemented as pure functions
 * Each function returns a new value without side effects
 */

// Basic arithmetic operations
export const add = (a: number, b: number): number => a + b;

export const subtract = (a: number, b: number): number => a - b;

export const multiply = (a: number, b: number): number => a * b;

export const divide = (a: number, b: number): number => {
    if (b === 0) {
        throw new Error('Division by zero');
    }
    return a / b;
};

// Additional calculator operations
export const percentage = (value: number): number => value / 100;

export const negate = (value: number): number =>
    value === 0 ? 0 : -value;

export const squareRoot = (value: number): number => {
    if (value < 0) {
        throw new Error('Cannot calculate square root of negative number');
    }
    return Math.sqrt(value);
};

// Calculator state transformations
export type CalculatorState = {
    displayValue: string;
    previousValue: number | null;
    operation: string | null;
    resetDisplay: boolean;
    memory: number;
};

// Create initial state
export const createInitialState = (): CalculatorState => ({
    displayValue: '0',
    previousValue: null,
    operation: null,
    resetDisplay: false,
    memory: 0
});

// Append digit to display value
export const appendDigit = (state: CalculatorState, digit: string): CalculatorState => {
    const { displayValue, resetDisplay } = state;

    if (resetDisplay) {
        return {
            ...state,
            displayValue: digit,
            resetDisplay: false
        };
    }

    // Handle special cases
    if (displayValue === '0' && digit !== '.') {
        return {
            ...state,
            displayValue: digit
        };
    }

    // Prevent multiple decimal points
    if (digit === '.' && displayValue.includes('.')) {
        return state;
    }

    return {
        ...state,
        displayValue: displayValue + digit
    };
};

// Clear calculator state
export const clear = (): CalculatorState =>
    createInitialState();

// Clear current entry
export const clearEntry = (state: CalculatorState): CalculatorState => ({
    ...state,
    displayValue: '0'
});

// Apply pending operation
export const calculateResult = (state: CalculatorState): CalculatorState => {
    if (!state.operation || state.operation === '=') {
        return state;
    }

    const prev = parseFloat(String(state.previousValue));
    const curr = parseFloat(state.displayValue);

    let result: number;

    try {
        switch (state.operation) {
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
                return state;
        }

        // Format the result to avoid floating point issues
        const resultStr = Number.isInteger(result) ? result.toString() : result.toFixed(10).replace(/\.?0+$/, '');

        return {
            ...state,
            displayValue: resultStr,
            previousValue: null,
            operation: null,
            resetDisplay: true
        };
    } catch (error) {
        return {
            ...state,
            displayValue: error instanceof Error ? error.message : 'Error',
            previousValue: null,
            operation: null,
            resetDisplay: true
        };
    }
};

// Set pending operation
export const setOperation = (state: CalculatorState, nextOperation: string): CalculatorState => {
    const { displayValue, previousValue, operation } = state;
    const currentValue = parseFloat(displayValue);

    // If there's already a pending operation, calculate the result first
    if (previousValue !== null && operation !== null && !state.resetDisplay) {
        const newState = calculateResult(state);
        return {
            ...newState,
            previousValue: parseFloat(newState.displayValue),
            operation: nextOperation,
            resetDisplay: true
        };
    }

    return {
        ...state,
        previousValue: currentValue,
        operation: nextOperation,
        resetDisplay: true
    };
};

// Memory operations
export const memoryStore = (state: CalculatorState): CalculatorState => ({
    ...state,
    memory: parseFloat(state.displayValue)
});

export const memoryRecall = (state: CalculatorState): CalculatorState => ({
    ...state,
    displayValue: String(state.memory),
    resetDisplay: true
});

export const memoryAdd = (state: CalculatorState): CalculatorState => ({
    ...state,
    memory: add(state.memory, parseFloat(state.displayValue))
});

export const memorySubtract = (state: CalculatorState): CalculatorState => ({
    ...state,
    memory: subtract(state.memory, parseFloat(state.displayValue))
});

export const memoryClear = (state: CalculatorState): CalculatorState => ({
    ...state,
    memory: 0
}); 