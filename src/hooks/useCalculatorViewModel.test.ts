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
}); 