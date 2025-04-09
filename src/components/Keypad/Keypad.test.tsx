import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import Keypad from './Keypad';

describe('Keypad Component', () => {
    const exampleNumberClick = vi.fn();
    const exampleOperatorClick = vi.fn();
    const exampleFunctionClick = vi.fn();

    beforeEach(() => {
        exampleNumberClick.mockClear();
        exampleOperatorClick.mockClear();
        exampleFunctionClick.mockClear();
    });

    it('renders all number buttons (0-9)', () => {
        render(
            <Keypad
                onNumberClick={exampleNumberClick}
                onOperatorClick={exampleOperatorClick}
                onFunctionClick={exampleFunctionClick}
            />
        );

        // Check for all digit buttons
        for (let i = 0; i <= 9; i++) {
            expect(screen.getByTestId(`button-${i}`)).toBeInTheDocument();
        }

        // Check for decimal point
        expect(screen.getByTestId('button-.')).toBeInTheDocument();
    });

    it('renders all operator buttons', () => {
        render(
            <Keypad
                onNumberClick={exampleNumberClick}
                onOperatorClick={exampleOperatorClick}
                onFunctionClick={exampleFunctionClick}
            />
        );

        // Check for operators
        expect(screen.getByTestId('button-+')).toBeInTheDocument();
        expect(screen.getByTestId('button--')).toBeInTheDocument();
        expect(screen.getByTestId('button-×')).toBeInTheDocument();
        expect(screen.getByTestId('button-÷')).toBeInTheDocument();
    });

    it('renders all function buttons', () => {
        render(
            <Keypad
                onNumberClick={exampleNumberClick}
                onOperatorClick={exampleOperatorClick}
                onFunctionClick={exampleFunctionClick}
            />
        );

        // Check for functions
        expect(screen.getByTestId('button-C')).toBeInTheDocument();
        expect(screen.getByTestId('button-±')).toBeInTheDocument();
        expect(screen.getByTestId('button-%')).toBeInTheDocument();
        expect(screen.getByTestId('button-=')).toBeInTheDocument();
    });

    it('calls onNumberClick with correct digit when number buttons are clicked', () => {
        render(
            <Keypad
                onNumberClick={exampleNumberClick}
                onOperatorClick={exampleOperatorClick}
                onFunctionClick={exampleFunctionClick}
            />
        );

        // Click on digit 5
        fireEvent.click(screen.getByTestId('button-5'));
        expect(exampleNumberClick).toHaveBeenCalledWith('5');

        // Click on decimal point
        fireEvent.click(screen.getByTestId('button-.'));
        expect(exampleNumberClick).toHaveBeenCalledWith('.');
    });

    it('calls onOperatorClick with correct operator when operator buttons are clicked', () => {
        render(
            <Keypad
                onNumberClick={exampleNumberClick}
                onOperatorClick={exampleOperatorClick}
                onFunctionClick={exampleFunctionClick}
            />
        );

        // Click on addition
        fireEvent.click(screen.getByTestId('button-+'));
        expect(exampleOperatorClick).toHaveBeenCalledWith('+');

        // Click on division
        fireEvent.click(screen.getByTestId('button-÷'));
        expect(exampleOperatorClick).toHaveBeenCalledWith('/');
    });

    it('calls onFunctionClick with correct function when function buttons are clicked', () => {
        render(
            <Keypad
                onNumberClick={exampleNumberClick}
                onOperatorClick={exampleOperatorClick}
                onFunctionClick={exampleFunctionClick}
            />
        );

        // Click on clear
        fireEvent.click(screen.getByTestId('button-C'));
        expect(exampleFunctionClick).toHaveBeenCalledWith('clear');

        // Click on equals
        fireEvent.click(screen.getByTestId('button-='));
        expect(exampleFunctionClick).toHaveBeenCalledWith('equals');
    });

    it('has the correct CSS class', () => {
        const { container } = render(
            <Keypad
                onNumberClick={exampleNumberClick}
                onOperatorClick={exampleOperatorClick}
                onFunctionClick={exampleFunctionClick}
            />
        );

        const keypadElement = container.firstChild as HTMLElement;
        expect(keypadElement).toHaveClass('calculator-keypad');
    });

    // New tests to improve coverage

    describe('Keyboard event handling', () => {
        beforeEach(() => {
            // Mock document.querySelector for the simulateButtonPress function
            document.querySelector = vi.fn().mockImplementation(() => {
                return {
                    classList: {
                        add: vi.fn(),
                        remove: vi.fn()
                    },
                    style: {}
                };
            });

            // Set up a fake timer for setTimeout
            vi.useFakeTimers();
            
            render(
                <Keypad
                    onNumberClick={exampleNumberClick}
                    onOperatorClick={exampleOperatorClick}
                    onFunctionClick={exampleFunctionClick}
                />
            );
        });

        afterEach(() => {
            vi.restoreAllMocks();
            vi.useRealTimers();
        });

        it('handles numeric key presses', () => {
            // Simulate pressing keys 0-9
            for (let i = 0; i <= 9; i++) {
                fireEvent.keyDown(window, { key: i.toString() });
                expect(exampleNumberClick).toHaveBeenCalledWith(i.toString());
                exampleNumberClick.mockClear();
            }
        });

        it('handles decimal point key press', () => {
            fireEvent.keyDown(window, { key: '.' });
            expect(exampleNumberClick).toHaveBeenCalledWith('.');
        });

        it('handles operator key presses', () => {
            // Test basic operators
            fireEvent.keyDown(window, { key: '+' });
            expect(exampleOperatorClick).toHaveBeenCalledWith('+');
            
            fireEvent.keyDown(window, { key: '-' });
            expect(exampleOperatorClick).toHaveBeenCalledWith('-');
            
            // Test multiplication variations
            fireEvent.keyDown(window, { key: '*' });
            expect(exampleOperatorClick).toHaveBeenCalledWith('*');
            
            fireEvent.keyDown(window, { key: 'x' });
            expect(exampleOperatorClick).toHaveBeenCalledWith('*');
            
            fireEvent.keyDown(window, { key: '×' });
            expect(exampleOperatorClick).toHaveBeenCalledWith('*');

            // Test division variations
            fireEvent.keyDown(window, { key: '/' });
            expect(exampleOperatorClick).toHaveBeenCalledWith('/');
            
            fireEvent.keyDown(window, { key: '÷' });
            expect(exampleOperatorClick).toHaveBeenCalledWith('/');
        });

        it('handles function key presses', () => {
            // Test equals
            fireEvent.keyDown(window, { key: 'Enter' });
            expect(exampleFunctionClick).toHaveBeenCalledWith('equals');
            
            fireEvent.keyDown(window, { key: '=' });
            expect(exampleFunctionClick).toHaveBeenCalledWith('equals');
            
            // Test clear
            fireEvent.keyDown(window, { key: 'Escape' });
            expect(exampleFunctionClick).toHaveBeenCalledWith('clear');
            
            fireEvent.keyDown(window, { key: 'c' });
            expect(exampleFunctionClick).toHaveBeenCalledWith('clear');
            
            fireEvent.keyDown(window, { key: 'C' });
            expect(exampleFunctionClick).toHaveBeenCalledWith('clear');
            
            // Test percent
            fireEvent.keyDown(window, { key: '%' });
            expect(exampleFunctionClick).toHaveBeenCalledWith('percent');
            
            // Test backspace (should trigger clear)
            fireEvent.keyDown(window, { key: 'Backspace' });
            expect(exampleFunctionClick).toHaveBeenCalledWith('clear');
        });

        it('simulates button press animation on key press', () => {
            const querySpy = vi.spyOn(document, 'querySelector');
            
            // Press a key that has a button mapping
            fireEvent.keyDown(window, { key: '5' });
            
            // Check if document.querySelector was called with the correct button ID
            expect(querySpy).toHaveBeenCalledWith('[data-testid="button-5"]');
            
            // Fast-forward time to trigger setTimeout callback
            vi.runAllTimers();
            
            // Clear for next test
            querySpy.mockClear();
            
            // Test another key
            fireEvent.keyDown(window, { key: '+' });
            expect(querySpy).toHaveBeenCalledWith('[data-testid="button-+"]');
            vi.runAllTimers();
        });

        it('ignores keys that have no mapping', () => {
            const querySpy = vi.spyOn(document, 'querySelector');
            
            // Press a key that has no button mapping
            fireEvent.keyDown(window, { key: 'a' });
            
            // Check that no callbacks were triggered
            expect(exampleNumberClick).not.toHaveBeenCalled();
            expect(exampleOperatorClick).not.toHaveBeenCalled();
            expect(exampleFunctionClick).not.toHaveBeenCalled();
            expect(querySpy).not.toHaveBeenCalled();
        });
    });

    it('properly cleans up keyboard event listener on unmount', () => {
        const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
        
        const { unmount } = render(
            <Keypad
                onNumberClick={exampleNumberClick}
                onOperatorClick={exampleOperatorClick}
                onFunctionClick={exampleFunctionClick}
            />
        );
        
        // Unmount the component
        unmount();
        
        // Check if removeEventListener was called with 'keydown'
        expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    });
}); 