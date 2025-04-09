/**
 * CalculatorViewModel - Transforms data between model and UI
 */
import { CalculatorModel, createCalculatorModel, withDisplayValue, withOperation } from "./CalculatorModel";
import { OperationType } from "../../store/calculatorStore";
import { appendDigit, calculateResult, setOperation } from "../../utils/calculations";
import { HistoryViewModel } from "../History/HistoryViewModel";

/**
 * ViewModel properties for the Calculator component
 */
export interface CalculatorViewProps {
    input: string;
    result: string;
    onNumberClick: (number: string) => void;
    onOperatorClick: (operator: string) => void;
    onFunctionClick: (func: string) => void;
    historyViewModel: HistoryViewModel;
}

/**
 * Maps the Calculator model to view properties
 */
export const mapToViewProps = (
    model: CalculatorModel,
    historyViewModel: HistoryViewModel,
    dispatch: (model: CalculatorModel) => void
): CalculatorViewProps => {
    // Format input display string based on model state
    const formatInput = (model: CalculatorModel): string => {
        if (!model.currentOperation) {
            return model.displayValue;
        }
        return `${model.previousValue} ${model.currentOperation}${model.shouldClearDisplay ? '' : ' ' + model.displayValue}`;
    };

    // Create handlers that dispatch model updates
    const handleNumberClick = (digit: string) => {
        const calculatorState = {
            displayValue: model.displayValue,
            previousValue: parseFloat(model.previousValue),
            operation: model.currentOperation,
            resetDisplay: model.shouldClearDisplay,
            memory: 0 // Not used in this context
        };

        const newState = appendDigit(calculatorState, digit);

        dispatch({
            ...model,
            displayValue: newState.displayValue,
            shouldClearDisplay: newState.resetDisplay
        });
    };

    const handleOperatorClick = (operator: string) => {
        // Map UI operator symbols to internal operation types
        const operationMap: Record<string, OperationType> = {
            '+': '+',
            '-': '-',
            '*': '*',
            '/': '/'
        };

        const operationType = operationMap[operator] as OperationType;

        // If there's a pending operation, calculate first
        if (model.currentOperation && !model.shouldClearDisplay) {
            const result = calculatePendingOperation(model);
            dispatch(withOperation(result, operationType));
        } else {
            dispatch(withOperation(model, operationType));
        }
    };

    const handleFunctionClick = (func: string) => {
        switch (func) {
            case 'clear':
                dispatch(createCalculatorModel());
                break;
            case 'equals':
                if (model.currentOperation) {
                    // Save the expression before calculating
                    const expression = `${model.previousValue} ${model.currentOperation} ${model.displayValue}`;
                    const result = calculatePendingOperation(model);

                    // Log the historic calculation
                    console.log('Adding to history from equals:', expression, result.displayValue);

                    // This will dispatch model updates and let the useCalculatorViewModel hook 
                    // update the store, which will handle adding to history
                    dispatch({
                        ...result,
                        historyExpression: expression,
                        historyResult: result.displayValue
                    });
                }
                break;
            case 'percent':
                const value = parseFloat(model.displayValue) / 100;
                dispatch(withDisplayValue(model, value.toString()));
                break;
            case 'negate':
                const newValue = parseFloat(model.displayValue) * -1;
                dispatch(withDisplayValue(model, newValue.toString()));
                break;
        }
    };

    return {
        input: formatInput(model),
        result: model.shouldClearDisplay ? model.displayValue : '',
        onNumberClick: handleNumberClick,
        onOperatorClick: handleOperatorClick,
        onFunctionClick: handleFunctionClick,
        historyViewModel
    };
};

/**
 * Helper function to calculate pending operations
 */
const calculatePendingOperation = (model: CalculatorModel): CalculatorModel => {
    if (!model.currentOperation) return model;

    const calculatorState = {
        displayValue: model.displayValue,
        previousValue: parseFloat(model.previousValue),
        operation: model.currentOperation,
        resetDisplay: model.shouldClearDisplay,
        memory: 0
    };

    try {
        // Save the expression for history
        const expression = `${model.previousValue} ${model.currentOperation} ${model.displayValue}`;

        const newState = calculateResult(calculatorState);

        // Return with history information
        return {
            ...model,
            displayValue: newState.displayValue,
            currentOperation: null,
            shouldClearDisplay: true,
            historyExpression: expression,
            historyResult: newState.displayValue
        };
    } catch (error) {
        return {
            ...model,
            displayValue: error instanceof Error ? error.message : 'Error',
            currentOperation: null,
            shouldClearDisplay: true
        };
    }
}; 