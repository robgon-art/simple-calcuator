import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import Display from './Display';

describe('Display Component', () => {
    it('renders input and result correctly', () => {
        render(<Display input="123" result="456" />);
        expect(screen.getByTestId('calculator-input')).toHaveTextContent('123');
        expect(screen.getByTestId('calculator-result')).toHaveTextContent('456');
    });

    it('displays 0 for empty input', () => {
        render(<Display input="" result="789" />);
        expect(screen.getByTestId('calculator-input')).toHaveTextContent('0');
        expect(screen.getByTestId('calculator-result')).toHaveTextContent('789');
    });

    it('displays empty string for empty result', () => {
        render(<Display input="123" result="" />);
        expect(screen.getByTestId('calculator-input')).toHaveTextContent('123');
        expect(screen.getByTestId('calculator-result')).toHaveTextContent('');
    });

    it('has the correct CSS classes', () => {
        const { container } = render(<Display input="123" result="456" />);
        const displayElement = container.firstChild as HTMLElement;
        expect(displayElement).toHaveClass('calculator-display');

        const inputElement = screen.getByTestId('calculator-input');
        expect(inputElement).toHaveClass('calculator-display-input');

        const resultElement = screen.getByTestId('calculator-result');
        expect(resultElement).toHaveClass('calculator-display-result');
    });
}); 