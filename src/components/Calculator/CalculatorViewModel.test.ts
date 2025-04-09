import { describe, it, expect, vi } from 'vitest';
import { mapToViewProps } from './CalculatorViewModel';
import { createCalculatorModel } from './CalculatorModel';
import { createHistoryViewModel } from '../History/HistoryViewModel';
import { createHistoryModel } from '../History/HistoryModel';

describe('CalculatorViewModel', () => {
    describe('mapToViewProps', () => {
        it('should format input without operation', () => {
            // Create model with just a display value
            const model = createCalculatorModel('123', '0', null, false);
            const historyModel = createHistoryModel();
            const historyViewModel = createHistoryViewModel(historyModel, vi.fn());
            const dispatch = vi.fn();

            const viewProps = mapToViewProps(model, historyViewModel, dispatch);

            expect(viewProps.input).toBe('123');
            expect(viewProps.result).toBe('');
        });

        it('should format input with operation when clearDisplay is true', () => {
            // Create model with operation and clearDisplay flag
            const model = createCalculatorModel('456', '123', '+', true);
            const historyModel = createHistoryModel();
            const historyViewModel = createHistoryViewModel(historyModel, vi.fn());
            const dispatch = vi.fn();

            const viewProps = mapToViewProps(model, historyViewModel, dispatch);

            expect(viewProps.input).toBe('123 +');
            expect(viewProps.result).toBe('456');
        });

        it('should format input with operation and display value when clearDisplay is false', () => {
            // Create model with operation and no clearDisplay flag
            const model = createCalculatorModel('456', '123', '+', false);
            const historyModel = createHistoryModel();
            const historyViewModel = createHistoryViewModel(historyModel, vi.fn());
            const dispatch = vi.fn();

            const viewProps = mapToViewProps(model, historyViewModel, dispatch);

            expect(viewProps.input).toBe('123 + 456');
            expect(viewProps.result).toBe('');
        });

        it('should handle number clicks correctly', () => {
            const model = createCalculatorModel('0', '0', null, false);
            const historyModel = createHistoryModel();
            const historyViewModel = createHistoryViewModel(historyModel, vi.fn());
            const dispatch = vi.fn();

            const viewProps = mapToViewProps(model, historyViewModel, dispatch);

            // Simulate clicking a number
            viewProps.onNumberClick('5');

            // Verify the model was updated correctly via dispatch
            expect(dispatch).toHaveBeenCalledTimes(1);
            const updatedModel = dispatch.mock.calls[0][0];
            expect(updatedModel.displayValue).toBe('5');
        });

        it('should handle operator clicks correctly', () => {
            const model = createCalculatorModel('123', '0', null, false);
            const historyModel = createHistoryModel();
            const historyViewModel = createHistoryViewModel(historyModel, vi.fn());
            const dispatch = vi.fn();

            const viewProps = mapToViewProps(model, historyViewModel, dispatch);

            // Simulate clicking an operator
            viewProps.onOperatorClick('+');

            // Verify the model was updated correctly via dispatch
            expect(dispatch).toHaveBeenCalledTimes(1);
            const updatedModel = dispatch.mock.calls[0][0];
            expect(updatedModel.currentOperation).toBe('+');
            expect(updatedModel.previousValue).toBe('123');
            expect(updatedModel.shouldClearDisplay).toBe(true);
        });

        it('should handle clear function correctly', () => {
            const model = createCalculatorModel('123', '456', '+', false);
            const historyModel = createHistoryModel();
            const historyViewModel = createHistoryViewModel(historyModel, vi.fn());
            const dispatch = vi.fn();

            const viewProps = mapToViewProps(model, historyViewModel, dispatch);

            // Simulate clicking clear
            viewProps.onFunctionClick('clear');

            // Verify the model was reset
            expect(dispatch).toHaveBeenCalledTimes(1);
            const updatedModel = dispatch.mock.calls[0][0];
            expect(updatedModel.displayValue).toBe('0');
            expect(updatedModel.previousValue).toBe('0');
            expect(updatedModel.currentOperation).toBeNull();
            expect(updatedModel.shouldClearDisplay).toBe(false);
        });

        it('should handle equals function with pending operation', () => {
            // Create model with a pending operation
            const model = createCalculatorModel('5', '10', '+', false);
            const historyModel = createHistoryModel();
            const historyViewModel = createHistoryViewModel(historyModel, vi.fn());
            const dispatch = vi.fn();

            const viewProps = mapToViewProps(model, historyViewModel, dispatch);

            // Simulate clicking equals
            viewProps.onFunctionClick('equals');

            // Verify calculation was performed
            expect(dispatch).toHaveBeenCalledTimes(1);
            const updatedModel = dispatch.mock.calls[0][0];
            expect(updatedModel.displayValue).toBe('15'); // 10 + 5 = 15
            expect(updatedModel.currentOperation).toBeNull();
            expect(updatedModel.shouldClearDisplay).toBe(true);
        });

        it('should handle percent function correctly', () => {
            const model = createCalculatorModel('200', '0', null, false);
            const historyModel = createHistoryModel();
            const historyViewModel = createHistoryViewModel(historyModel, vi.fn());
            const dispatch = vi.fn();

            const viewProps = mapToViewProps(model, historyViewModel, dispatch);

            // Simulate clicking percent
            viewProps.onFunctionClick('percent');

            // Verify the model was updated correctly
            expect(dispatch).toHaveBeenCalledTimes(1);
            const updatedModel = dispatch.mock.calls[0][0];
            expect(updatedModel.displayValue).toBe('2'); // 200/100 = 2
        });

        it('should handle negate function correctly', () => {
            const model = createCalculatorModel('42', '0', null, false);
            const historyModel = createHistoryModel();
            const historyViewModel = createHistoryViewModel(historyModel, vi.fn());
            const dispatch = vi.fn();

            const viewProps = mapToViewProps(model, historyViewModel, dispatch);

            // Simulate clicking negate
            viewProps.onFunctionClick('negate');

            // Verify the model was updated correctly
            expect(dispatch).toHaveBeenCalledTimes(1);
            const updatedModel = dispatch.mock.calls[0][0];
            expect(updatedModel.displayValue).toBe('-42');
        });

        it('should handle division by zero error during equals operation', () => {
            // Create model with a division by zero
            const model = createCalculatorModel('0', '5', '/', false);
            const historyModel = createHistoryModel();
            const historyViewModel = createHistoryViewModel(historyModel, vi.fn());
            const dispatch = vi.fn();

            const viewProps = mapToViewProps(model, historyViewModel, dispatch);

            // Simulate clicking equals
            viewProps.onFunctionClick('equals');

            // Verify error was handled
            expect(dispatch).toHaveBeenCalledTimes(1);
            const updatedModel = dispatch.mock.calls[0][0];
            expect(updatedModel.displayValue).toBe('Division by zero');
            expect(updatedModel.currentOperation).toBeNull();
            expect(updatedModel.shouldClearDisplay).toBe(true);
        });

        it('should calculate pending operation for operator chain', () => {
            // Create model with a pending operation and click another operator
            const model = createCalculatorModel('5', '10', '+', false);
            const historyModel = createHistoryModel();
            const historyViewModel = createHistoryViewModel(historyModel, vi.fn());
            const dispatch = vi.fn();

            const viewProps = mapToViewProps(model, historyViewModel, dispatch);

            // Simulate clicking another operator
            viewProps.onOperatorClick('*');

            // Verify first calculation was performed before setting new operator
            expect(dispatch).toHaveBeenCalledTimes(1);
            const updatedModel = dispatch.mock.calls[0][0];
            expect(updatedModel.displayValue).toBe('15'); // 10 + 5 = 15
            expect(updatedModel.previousValue).toBe('15');
            expect(updatedModel.currentOperation).toBe('*');
            expect(updatedModel.shouldClearDisplay).toBe(true);
        });

        it('should set history information when equals is clicked', () => {
            // Create model with a pending operation
            const model = createCalculatorModel('5', '10', '+', false);
            const historyModel = createHistoryModel();
            const historyViewModel = createHistoryViewModel(historyModel, vi.fn());
            const dispatch = vi.fn();

            const viewProps = mapToViewProps(model, historyViewModel, dispatch);

            // Simulate clicking equals
            viewProps.onFunctionClick('equals');

            // Verify calculation was performed and history info was set
            expect(dispatch).toHaveBeenCalledTimes(1);
            const updatedModel = dispatch.mock.calls[0][0];
            expect(updatedModel.displayValue).toBe('15'); // 10 + 5 = 15
            expect(updatedModel.historyExpression).toBe('10 + 5');
            expect(updatedModel.historyResult).toBe('15');
        });
    });
}); 