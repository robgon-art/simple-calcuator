/**
 * CalculatorModel - Immutable data model for calculator state
 */

import { OperationType } from "../../store/calculatorStore";

/**
 * Pure immutable model for calculator state
 */
export interface CalculatorModel {
    readonly displayValue: string;
    readonly previousValue: string;
    readonly currentOperation: OperationType;
    readonly shouldClearDisplay: boolean;
}

/**
 * Factory function to create a new CalculatorModel
 */
export const createCalculatorModel = (
    displayValue: string = '0',
    previousValue: string = '0',
    currentOperation: OperationType = null,
    shouldClearDisplay: boolean = false
): CalculatorModel => ({
    displayValue,
    previousValue,
    currentOperation,
    shouldClearDisplay
});

/**
 * Creates a new model by updating the display value 
 */
export const withDisplayValue = (model: CalculatorModel, value: string): CalculatorModel => ({
    ...model,
    displayValue: value
});

/**
 * Creates a new model by updating the operation
 */
export const withOperation = (model: CalculatorModel, operation: OperationType): CalculatorModel => ({
    ...model,
    currentOperation: operation,
    previousValue: model.displayValue,
    shouldClearDisplay: true
});

/**
 * Creates a new model with the shouldClearDisplay flag toggled
 */
export const withClearDisplayFlag = (model: CalculatorModel, flag: boolean): CalculatorModel => ({
    ...model,
    shouldClearDisplay: flag
});

/**
 * Creates a fresh model (resets everything)
 */
export const clearAll = (): CalculatorModel => createCalculatorModel();

/**
 * Clears only the current entry
 */
export const clearEntry = (model: CalculatorModel): CalculatorModel => ({
    ...model,
    displayValue: '0'
}); 