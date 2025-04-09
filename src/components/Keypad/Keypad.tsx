import React, { useEffect } from 'react';
import Button from '../Button/Button';
import './Keypad.css';

interface KeypadProps {
    onNumberClick: (number: string) => void;
    onOperatorClick: (operator: string) => void;
    onFunctionClick: (func: string) => void;
}

const Keypad: React.FC<KeypadProps> = ({
    onNumberClick,
    onOperatorClick,
    onFunctionClick
}) => {
    // Map keys to button elements
    const keyToButtonId: {[key: string]: string} = {
        '0': 'button-0',
        '1': 'button-1',
        '2': 'button-2',
        '3': 'button-3',
        '4': 'button-4',
        '5': 'button-5',
        '6': 'button-6',
        '7': 'button-7',
        '8': 'button-8',
        '9': 'button-9',
        '.': 'button-.',
        '+': 'button-+',
        '-': 'button--',
        '*': 'button-×',
        '/': 'button-÷',
        'x': 'button-×',
        '×': 'button-×',
        '÷': 'button-÷',
        'Enter': 'button-=',
        '=': 'button-=',
        'Escape': 'button-C',
        'c': 'button-C',
        'C': 'button-C',
        '%': 'button-%',
        'Backspace': 'button-C'
    };

    // Function to simulate button press animation
    const simulateButtonPress = (buttonId: string) => {
        const button = document.querySelector(`[data-testid="${buttonId}"]`) as HTMLButtonElement;
        if (button) {
            // Add active class
            button.classList.add('active-key');
            
            // Apply CSS transform directly
            button.style.transform = 'scale(0.95)';
            
            // Reset after animation
            setTimeout(() => {
                button.classList.remove('active-key');
                button.style.transform = '';
            }, 100);
        }
    };

    // Add keyboard event handler
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const key = event.key;
            const buttonId = keyToButtonId[key];
            
            // First simulate the button press if we have a mapping
            if (buttonId) {
                simulateButtonPress(buttonId);
            }
            
            // Numbers
            if (/^[0-9]$/.test(key)) {
                onNumberClick(key);
            }
            // Decimal point
            else if (key === '.') {
                onNumberClick('.');
            }
            // Operators
            else if (key === '+') {
                onOperatorClick('+');
            }
            else if (key === '-') {
                onOperatorClick('-');
            }
            else if (key === '*' || key === 'x' || key === '×') {
                onOperatorClick('*');
            }
            else if (key === '/' || key === '÷') {
                onOperatorClick('/');
            }
            // Functions
            else if (key === 'Enter' || key === '=') {
                onFunctionClick('equals');
            }
            else if (key === 'Escape' || key === 'c' || key === 'C') {
                onFunctionClick('clear');
            }
            else if (key === '%') {
                onFunctionClick('percent');
            }
            // Backspace could be interpreted as clear in this simple calculator
            else if (key === 'Backspace') {
                onFunctionClick('clear');
            }
        };

        // Add event listener
        window.addEventListener('keydown', handleKeyDown);
        
        // Clean up event listener
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onNumberClick, onOperatorClick, onFunctionClick]);

    return (
        <div className="calculator-keypad">
            <div className="keypad-row">
                <Button label="C" type="function" onClick={() => onFunctionClick('clear')} />
                <Button label="±" type="function" onClick={() => onFunctionClick('negate')} />
                <Button label="%" type="function" onClick={() => onFunctionClick('percent')} />
                <Button label="÷" type="operator" onClick={() => onOperatorClick('/')} />
            </div>
            <div className="keypad-row">
                <Button label="7" onClick={() => onNumberClick('7')} />
                <Button label="8" onClick={() => onNumberClick('8')} />
                <Button label="9" onClick={() => onNumberClick('9')} />
                <Button label="×" type="operator" onClick={() => onOperatorClick('*')} />
            </div>
            <div className="keypad-row">
                <Button label="4" onClick={() => onNumberClick('4')} />
                <Button label="5" onClick={() => onNumberClick('5')} />
                <Button label="6" onClick={() => onNumberClick('6')} />
                <Button label="-" type="operator" onClick={() => onOperatorClick('-')} />
            </div>
            <div className="keypad-row">
                <Button label="1" onClick={() => onNumberClick('1')} />
                <Button label="2" onClick={() => onNumberClick('2')} />
                <Button label="3" onClick={() => onNumberClick('3')} />
                <Button label="+" type="operator" onClick={() => onOperatorClick('+')} />
            </div>
            <div className="keypad-row">
                <Button label="0" className="button-wide" onClick={() => onNumberClick('0')} />
                <Button label="." onClick={() => onNumberClick('.')} />
                <Button label="=" type="function" onClick={() => onFunctionClick('equals')} />
            </div>
        </div>
    );
};

export default Keypad; 