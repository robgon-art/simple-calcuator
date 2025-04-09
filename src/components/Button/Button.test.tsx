import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import Button from './Button';

describe('Button Component', () => {
    it('renders with the correct label', () => {
        render(<Button label="7" onClick={() => { }} />);
        expect(screen.getByText('7')).toBeInTheDocument();
    });

    it('applies the correct CSS classes based on type prop', () => {
        const { container } = render(<Button label="+" type="operator" onClick={() => { }} />);
        const button = container.firstChild as HTMLElement;
        expect(button).toHaveClass('calculator-button');
        expect(button).toHaveClass('operator');
    });

    it('applies the default number type when type is not specified', () => {
        const { container } = render(<Button label="5" onClick={() => { }} />);
        const button = container.firstChild as HTMLElement;
        expect(button).toHaveClass('calculator-button');
        expect(button).toHaveClass('number');
    });

    it('applies additional className when provided', () => {
        const { container } = render(
            <Button label="C" type="function" className="clear-btn" onClick={() => { }} />
        );
        const button = container.firstChild as HTMLElement;
        expect(button).toHaveClass('calculator-button');
        expect(button).toHaveClass('function');
        expect(button).toHaveClass('clear-btn');
    });

    it('calls onClick handler when clicked', () => {
        const handleClick = vi.fn();
        render(<Button label="9" onClick={handleClick} />);

        fireEvent.click(screen.getByText('9'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('sets the correct data-testid attribute', () => {
        render(<Button label="=" type="operator" onClick={() => { }} />);
        expect(screen.getByTestId('button-=')).toBeInTheDocument();
    });
}); 