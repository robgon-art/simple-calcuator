import { describe, it, expect } from 'vitest';
import {
    CalculatorModel,
    createCalculatorModel,
    withDisplayValue,
    withOperation,
    withClearDisplayFlag,
    clearAll,
    clearEntry
} from './CalculatorModel';

describe('CalculatorModel', () => {
    describe('createCalculatorModel', () => {
        it('should create a model with default values', () => {
            const model = createCalculatorModel();

            expect(model.displayValue).toBe('0');
            expect(model.previousValue).toBe('0');
            expect(model.currentOperation).toBeNull();
            expect(model.shouldClearDisplay).toBe(false);
        });

        it('should create a model with provided values', () => {
            const model = createCalculatorModel('123', '456', '+', true);

            expect(model.displayValue).toBe('123');
            expect(model.previousValue).toBe('456');
            expect(model.currentOperation).toBe('+');
            expect(model.shouldClearDisplay).toBe(true);
        });
    });

    describe('withDisplayValue', () => {
        it('should update the display value and keep other properties', () => {
            const originalModel = createCalculatorModel('0', '10', '+', true);
            const updatedModel = withDisplayValue(originalModel, '5');

            // Check that the display value was updated
            expect(updatedModel.displayValue).toBe('5');

            // Check that other properties weren't modified
            expect(updatedModel.previousValue).toBe('10');
            expect(updatedModel.currentOperation).toBe('+');
            expect(updatedModel.shouldClearDisplay).toBe(true);

            // Verify immutability - original model should be unchanged
            expect(originalModel.displayValue).toBe('0');
        });
    });

    describe('withOperation', () => {
        it('should set the operation, store previous value, and set clear flag', () => {
            const originalModel = createCalculatorModel('123', '0', null, false);
            const updatedModel = withOperation(originalModel, '+');

            expect(updatedModel.currentOperation).toBe('+');
            expect(updatedModel.previousValue).toBe('123');
            expect(updatedModel.shouldClearDisplay).toBe(true);

            // Original model should be unchanged
            expect(originalModel.currentOperation).toBeNull();
        });
    });

    describe('withClearDisplayFlag', () => {
        it('should update the clear display flag', () => {
            const originalModel = createCalculatorModel('123', '0', null, false);
            const updatedModel = withClearDisplayFlag(originalModel, true);

            expect(updatedModel.shouldClearDisplay).toBe(true);

            // Other properties should remain the same
            expect(updatedModel.displayValue).toBe('123');
            expect(updatedModel.previousValue).toBe('0');
            expect(updatedModel.currentOperation).toBeNull();
        });
    });

    describe('clearAll', () => {
        it('should reset all properties to default values', () => {
            const originalModel = createCalculatorModel('123', '456', '+', true);
            const clearedModel = clearAll();

            expect(clearedModel.displayValue).toBe('0');
            expect(clearedModel.previousValue).toBe('0');
            expect(clearedModel.currentOperation).toBeNull();
            expect(clearedModel.shouldClearDisplay).toBe(false);
        });
    });

    describe('clearEntry', () => {
        it('should reset only the display value', () => {
            const originalModel = createCalculatorModel('123', '456', '+', true);
            const clearedModel = clearEntry(originalModel);

            // Display value should be reset
            expect(clearedModel.displayValue).toBe('0');

            // Other properties should remain unchanged
            expect(clearedModel.previousValue).toBe('456');
            expect(clearedModel.currentOperation).toBe('+');
            expect(clearedModel.shouldClearDisplay).toBe(true);
        });
    });
}); 