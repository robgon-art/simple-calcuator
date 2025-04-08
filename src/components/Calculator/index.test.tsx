import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import Calculator from './index';

// Mock the Calculator dependencies
vi.mock('../../hooks/useCalculatorViewModel', () => ({
    useCalculatorViewModel: () => ({
        input: '123',
        result: '123',
        onNumberClick: vi.fn(),
        onOperatorClick: vi.fn(),
        onFunctionClick: vi.fn(),
        historyViewModel: {
            viewProps: {
                entries: [],
                onSelectEntry: vi.fn()
            }
        }
    })
}));

describe('Calculator Component', () => {
    it('renders the Calculator component correctly', () => {
        render(<Calculator />);

        // Check if Display component is rendered
        expect(screen.getByTestId('calculator-input')).toBeInTheDocument();
        expect(screen.getByTestId('calculator-result')).toBeInTheDocument();

        // Check if History component is rendered
        expect(screen.getByTestId('calculator-history')).toBeInTheDocument();
    });

    it('displays the values from the view model', () => {
        render(<Calculator />);
        expect(screen.getByTestId('calculator-input')).toHaveTextContent('123');
        expect(screen.getByTestId('calculator-result')).toHaveTextContent('123');
    });

    it('has the correct structure and CSS classes', () => {
        const { container } = render(<Calculator />);

        // The main calculator container
        const calculatorContainer = container.firstChild as HTMLElement;
        expect(calculatorContainer).toHaveClass('calculator-container');

        // The calculator body that contains Display and Keypad
        const calculatorBody = calculatorContainer.firstChild as HTMLElement;
        expect(calculatorBody).toHaveClass('calculator-body');

        // Check if keypad is rendered (indirectly through buttons)
        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThan(0);
    });
}); 