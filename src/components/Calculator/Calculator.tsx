import React, { useEffect } from 'react';
import Display from '../Display/Display';
import Keypad from '../Keypad/Keypad';
import History from '../History/History';
import './Calculator.css';
import { useCalculatorViewModel } from '../../hooks/useCalculatorViewModel';
import { observer } from 'mobx-react-lite';
import { calculatorStore } from '../../store/calculatorStore';

const Calculator: React.FC = () => {
    // Use our view model hook to get all the props and handlers
    const { input, result, onNumberClick, onOperatorClick, onFunctionClick, historyViewModel } = useCalculatorViewModel();

    useEffect(() => {
        console.log('Calculator rendered. History entries:', calculatorStore.history.length);
    });

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
            <div>
                <p>History items: {calculatorStore.history.length}</p>
                <History
                    entries={historyViewModel.viewProps.entries}
                    onSelectEntry={historyViewModel.viewProps.onSelectEntry}
                />
            </div>
        </div>
    );
};

export default observer(Calculator); 