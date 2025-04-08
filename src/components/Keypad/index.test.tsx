import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import Keypad from './index';

describe('Keypad Component', () => {
    const mockNumberClick = vi.fn();
    const mockOperatorClick = vi.fn();
    const mockFunctionClick = vi.fn();

    beforeEach(() => {
        mockNumberClick.mockClear();
        mockOperatorClick.mockClear();
        mockFunctionClick.mockClear();
    });

    it('renders all number buttons (0-9)', () => {
        render(
            <Keypad
                onNumberClick={mockNumberClick}
                onOperatorClick={mockOperatorClick}
                onFunctionClick={mockFunctionClick}
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
                onNumberClick={mockNumberClick}
                onOperatorClick={mockOperatorClick}
                onFunctionClick={mockFunctionClick}
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
                onNumberClick={mockNumberClick}
                onOperatorClick={mockOperatorClick}
                onFunctionClick={mockFunctionClick}
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
                onNumberClick={mockNumberClick}
                onOperatorClick={mockOperatorClick}
                onFunctionClick={mockFunctionClick}
            />
        );

        // Click on digit 5
        fireEvent.click(screen.getByTestId('button-5'));
        expect(mockNumberClick).toHaveBeenCalledWith('5');

        // Click on decimal point
        fireEvent.click(screen.getByTestId('button-.'));
        expect(mockNumberClick).toHaveBeenCalledWith('.');
    });

    it('calls onOperatorClick with correct operator when operator buttons are clicked', () => {
        render(
            <Keypad
                onNumberClick={mockNumberClick}
                onOperatorClick={mockOperatorClick}
                onFunctionClick={mockFunctionClick}
            />
        );

        // Click on addition
        fireEvent.click(screen.getByTestId('button-+'));
        expect(mockOperatorClick).toHaveBeenCalledWith('+');

        // Click on division
        fireEvent.click(screen.getByTestId('button-÷'));
        expect(mockOperatorClick).toHaveBeenCalledWith('/');
    });

    it('calls onFunctionClick with correct function when function buttons are clicked', () => {
        render(
            <Keypad
                onNumberClick={mockNumberClick}
                onOperatorClick={mockOperatorClick}
                onFunctionClick={mockFunctionClick}
            />
        );

        // Click on clear
        fireEvent.click(screen.getByTestId('button-C'));
        expect(mockFunctionClick).toHaveBeenCalledWith('clear');

        // Click on equals
        fireEvent.click(screen.getByTestId('button-='));
        expect(mockFunctionClick).toHaveBeenCalledWith('equals');
    });

    it('has the correct CSS class', () => {
        const { container } = render(
            <Keypad
                onNumberClick={mockNumberClick}
                onOperatorClick={mockOperatorClick}
                onFunctionClick={mockFunctionClick}
            />
        );

        const keypadElement = container.firstChild as HTMLElement;
        expect(keypadElement).toHaveClass('calculator-keypad');
    });
}); 