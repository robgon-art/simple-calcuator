import React, { useState } from 'react';
import Display from '../Display';
import Keypad from '../Keypad';
import History from '../History';
import './styles.css';

// Import the HistoryEntry type from the History component file
import type { HistoryEntry } from '../History/types';

const Calculator: React.FC = () => {
    // These states would typically be handled by a state management solution like MobX
    // But for now, we're just creating a UI shell without business logic
    const [input, setInput] = useState<string>('');
    const [result, setResult] = useState<string>('');
    const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);

    // Placeholder handlers that will be implemented later with actual business logic
    const handleNumberClick = (number: string) => {
        console.log(`Number clicked: ${number}`);
        // Dummy usage to prevent unused variable warnings
        setInput(prev => prev + number);
    };

    const handleOperatorClick = (operator: string) => {
        console.log(`Operator clicked: ${operator}`);
        setInput(prev => `${prev} ${operator} `);
    };

    const handleFunctionClick = (func: string) => {
        console.log(`Function clicked: ${func}`);
        if (func === 'clear') {
            setInput('');
            setResult('');
        } else if (func === 'equals') {
            setResult(input);
        }
    };

    const handleHistoryEntrySelect = (entry: HistoryEntry) => {
        console.log('History entry selected:', entry);
        setInput(entry.expression);
        setResult(entry.result);
    };

    return (
        <div className="calculator-container">
            <div className="calculator-body">
                <Display input={input} result={result} />
                <Keypad
                    onNumberClick={handleNumberClick}
                    onOperatorClick={handleOperatorClick}
                    onFunctionClick={handleFunctionClick}
                />
            </div>
            <History
                entries={historyEntries}
                onSelectEntry={handleHistoryEntrySelect}
            />
        </div>
    );
};

export default Calculator; 