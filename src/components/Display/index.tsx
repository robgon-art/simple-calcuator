import React from 'react';
import './styles.css';

interface DisplayProps {
    input: string;
    result: string;
}

const Display: React.FC<DisplayProps> = ({ input, result }) => {
    return (
        <div className="calculator-display">
            <div className="calculator-display-input" data-testid="calculator-input">
                {input || '0'}
            </div>
            <div className="calculator-display-result" data-testid="calculator-result">
                {result || ''}
            </div>
        </div>
    );
};

export default Display; 