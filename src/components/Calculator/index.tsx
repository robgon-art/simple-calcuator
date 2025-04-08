import React from 'react';
import Display from '../Display';
import Keypad from '../Keypad';
import History from '../History';
import './styles.css';
import { useCalculatorViewModel } from '../../hooks/useCalculatorViewModel';
import { observer } from 'mobx-react-lite';

const Calculator: React.FC = () => {
    // Use our view model hook to get all the props and handlers
    const { input, result, onNumberClick, onOperatorClick, onFunctionClick, historyViewModel } = useCalculatorViewModel();

    return (
        <div className="calculator-container">
            <div className="calculator-body">
                <Display input={input} result={result} />
                <Keypad
                    onNumberClick={onNumberClick}
                    onOperatorClick={onOperatorClick}
                    onFunctionClick={onFunctionClick}
                />
            </div>
            <History
                entries={historyViewModel.viewProps.entries}
                onSelectEntry={historyViewModel.viewProps.onSelectEntry}
            />
        </div>
    );
};

export default observer(Calculator); 