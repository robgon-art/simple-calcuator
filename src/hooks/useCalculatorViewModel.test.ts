import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCalculatorViewModel, useHistoryActions } from './useCalculatorViewModel';
import { calculatorStore } from '../store/calculatorStore';
import { configure } from 'mobx';

// Turn off strict mode for testing purposes
beforeEach(() => {
  // Allow state modifications outside actions for testing
  configure({ enforceActions: 'never' });

  // Reset the store to initial state before each test
  calculatorStore.clearAll();
  calculatorStore.clearHistory();
});

describe('useCalculatorViewModel', () => {
  it('should return view props based on store state', () => {
    const { result } = renderHook(() => useCalculatorViewModel());

    expect(result.current.input).toBe('0');
    expect(result.current.result).toBe('');
    expect(typeof result.current.onNumberClick).toBe('function');
    expect(typeof result.current.onOperatorClick).toBe('function');
    expect(typeof result.current.onFunctionClick).toBe('function');
    expect(result.current.historyViewModel).toBeDefined();
  });

  it('should update view props when store state changes', () => {
    const { result, rerender } = renderHook(() => useCalculatorViewModel());

    // Change store state
    act(() => {
      calculatorStore.currentValue = '42';
    });

    // Force re-render
    rerender();

    expect(result.current.input).toBe('42');
  });

  it('should update store when number is clicked', () => {
    const { result } = renderHook(() => useCalculatorViewModel());

    // Call the number click handler
    act(() => {
      result.current.onNumberClick('7');
    });

    // Verify store state directly
    expect(calculatorStore.currentValue).toBe('7');
  });

  it('should update store when operator is clicked', () => {
    // First set a value
    act(() => {
      calculatorStore.currentValue = '5';
    });

    const { result } = renderHook(() => useCalculatorViewModel());

    // Call the operator click handler
    act(() => {
      result.current.onOperatorClick('+');
    });

    // Verify store state directly
    expect(calculatorStore.previousValue).toBe('5');
    expect(calculatorStore.currentOperation).toBe('+');
    expect(calculatorStore.shouldClearDisplay).toBe(true);
  });

  it('should update store when function is clicked', () => {
    // First set a value
    act(() => {
      calculatorStore.currentValue = '5';
    });

    const { result } = renderHook(() => useCalculatorViewModel());

    // Call the function click handler with 'clear'
    act(() => {
      result.current.onFunctionClick('clear');
    });

    // Verify store state directly
    expect(calculatorStore.currentValue).toBe('0');
    expect(calculatorStore.previousValue).toBe('0');
    expect(calculatorStore.currentOperation).toBe(null);
  });

  it('should add to history when model contains history info', () => {
    // Clear any existing history
    calculatorStore.clearHistory();

    // Set up initial state to make the test more deterministic
    calculatorStore.currentValue = '5';
    calculatorStore.previousValue = '0';
    calculatorStore.currentOperation = null;
    calculatorStore.shouldClearDisplay = false;

    const { result } = renderHook(() => useCalculatorViewModel());

    // Call the operator click handler
    act(() => {
      result.current.onOperatorClick('+');
    });

    // Ensure store is properly updated
    expect(calculatorStore.previousValue).toBe('5');
    expect(calculatorStore.currentOperation).toBe('+');

    // Set new display value - this would normally happen through UI
    act(() => {
      calculatorStore.currentValue = '10';
      calculatorStore.shouldClearDisplay = false;
    });

    // Call the calculator store's calculate method directly
    act(() => {
      calculatorStore.calculateResult();
    });

    // Check history directly
    expect(calculatorStore.history.length).toBe(1);
    expect(calculatorStore.history[0].expression).toBe('5 + 10');
    expect(calculatorStore.history[0].result).toBe('15');
  });

  it('should handle history entry selection', () => {
    // First add an item to history
    calculatorStore.addToHistory('10 + 5', '15');

    // Then render the hook
    const { result } = renderHook(() => useCalculatorViewModel());

    // Get the first history entry
    const firstEntry = result.current.historyViewModel.viewProps.entries[0];

    // Simulate selecting the entry by calling the onSelectEntry handler
    act(() => {
      result.current.historyViewModel.viewProps.onSelectEntry(firstEntry);
    });

    // Check that the store state was updated correctly
    expect(calculatorStore.currentValue).toBe('15');
    expect(calculatorStore.shouldClearDisplay).toBe(true);
  });

  it('should create history view model with sorted entries', () => {
    // Clear any existing history
    calculatorStore.clearHistory();

    // Add items with explicit timestamps instead of using Date.now mocks
    calculatorStore.history.push({
      expression: '1 + 1',
      result: '2',
      timestamp: 1000 // oldest
    });

    calculatorStore.history.push({
      expression: '2 + 2',
      result: '4',
      timestamp: 2000 // middle
    });

    calculatorStore.history.push({
      expression: '3 + 3',
      result: '6',
      timestamp: 3000 // newest
    });

    // Then render the hook
    const { result } = renderHook(() => useCalculatorViewModel());

    // Check that entries are sorted by timestamp (newest first)
    const entries = result.current.historyViewModel.viewProps.entries;
    expect(entries.length).toBe(3);
    expect(entries[0].result).toBe('6');
    expect(entries[1].result).toBe('4');
    expect(entries[2].result).toBe('2');
  });
});

describe('useHistoryActions', () => {
  it('should call addToHistory on the store', () => {
    // Spy on the addToHistory method
    vi.spyOn(calculatorStore, 'addToHistory');

    const { result } = renderHook(() => useHistoryActions());

    act(() => {
      result.current.addToHistory('1 + 1', '2');
    });

    expect(calculatorStore.addToHistory).toHaveBeenCalledWith('1 + 1', '2');
  });

  it('should call clearHistory on the store', () => {
    // Spy on the clearHistory method
    vi.spyOn(calculatorStore, 'clearHistory');

    const { result } = renderHook(() => useHistoryActions());

    act(() => {
      result.current.clearHistory();
    });

    expect(calculatorStore.clearHistory).toHaveBeenCalled();
  });

  it('should handle history entry selection', () => {
    // First add an item to history
    calculatorStore.addToHistory('10 + 5', '15');

    // Then render the hook
    const { result } = renderHook(() => useCalculatorViewModel());

    // Get the first history entry
    const firstEntry = result.current.historyViewModel.viewProps.entries[0];

    // Simulate selecting the entry by calling the onSelectEntry handler
    act(() => {
      result.current.historyViewModel.viewProps.onSelectEntry(firstEntry);
    });

    // Check that the store state was updated correctly
    expect(calculatorStore.currentValue).toBe('15');
    expect(calculatorStore.shouldClearDisplay).toBe(true);
  });
}); 