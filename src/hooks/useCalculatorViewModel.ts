/**
 * Hook to connect MobX store to CalculatorViewModel
 */
import { useCallback, useMemo } from "react";
import { CalculatorModel, createCalculatorModel } from "../components/Calculator/CalculatorModel";
import { CalculatorViewProps, mapToViewProps } from "../components/Calculator/CalculatorViewModel";
import { calculatorStore } from "../store/calculatorStore";
import { HistoryModel, createHistoryModel, createHistoryEntry } from "../components/History/HistoryModel";
import { createHistoryViewModel } from "../components/History/HistoryViewModel";
import { action } from "mobx";

/**
 * Hook that creates view props for the Calculator component from the MobX store
 */
export const useCalculatorViewModel = (): CalculatorViewProps => {
    // Map store state to Calculator model using the factory function
    const calculatorModel: CalculatorModel = useMemo(() =>
        createCalculatorModel(
            calculatorStore.currentValue,
            calculatorStore.previousValue,
            calculatorStore.currentOperation,
            calculatorStore.shouldClearDisplay
        ), [
        calculatorStore.currentValue,
        calculatorStore.previousValue,
        calculatorStore.currentOperation,
        calculatorStore.shouldClearDisplay
    ]);

    // Map store state to History model
    const historyModel: HistoryModel = useMemo(() => {
        console.log('Store history items:', calculatorStore.history.length, calculatorStore.history);

        const entries = calculatorStore.history.map(item =>
            createHistoryEntry(item.expression, item.result, item.timestamp)
        );

        console.log('Mapped history entries:', entries.length, entries);

        return createHistoryModel(entries);
    }, [calculatorStore.history.length]);

    // Create function to handle model updates
    const dispatchModelUpdate = useCallback((model: CalculatorModel) => {
        // Update the store based on model changes
        action(() => {
            calculatorStore.currentValue = model.displayValue;
            calculatorStore.previousValue = model.previousValue;
            calculatorStore.currentOperation = model.currentOperation;
            calculatorStore.shouldClearDisplay = model.shouldClearDisplay;

            // If we have history info, add it to the history
            if (model.historyExpression && model.historyResult) {
                console.log('Adding to history from dispatchModelUpdate:',
                    model.historyExpression, model.historyResult);
                calculatorStore.addToHistory(model.historyExpression, model.historyResult);
            }
        })();
    }, []);

    // Create history view model
    const historyViewModel = useMemo(() => {
        const viewModel = createHistoryViewModel(historyModel, (entry) => {
            // When a history entry is selected
            action(() => {
                calculatorStore.currentValue = entry.result;
                calculatorStore.shouldClearDisplay = true;
            })();
        });

        console.log('History view model props:', viewModel.viewProps);

        return viewModel;
    }, [historyModel]);

    // Map models to view props
    return mapToViewProps(calculatorModel, historyViewModel, dispatchModelUpdate);
};

/**
 * Returns a function to add items to history
 */
export const useHistoryActions = () => {
    const addToHistory = useCallback((expression: string, result: string) => {
        action(() => {
            calculatorStore.addToHistory(expression, result);
        })();
    }, []);

    const clearHistory = useCallback(() => {
        action(() => {
            calculatorStore.clearHistory();
        })();
    }, []);

    return { addToHistory, clearHistory };
}; 