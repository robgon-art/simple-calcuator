import React from 'react';
import Button from '../Button';
import './styles.css';

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