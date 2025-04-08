import React, { useEffect, useRef } from 'react';
import { html, render } from 'lit-html';
import './styles.css';
import { observer } from 'mobx-react-lite';
import type { HistoryEntry } from './types';

interface HistoryProps {
  entries: HistoryEntry[];
  onSelectEntry?: (entry: HistoryEntry) => void;
}

// Lit template function for rendering history
const createHistoryTemplate = (entries: HistoryEntry[], onSelectEntry?: (entry: HistoryEntry) => void) => {
  return html`
    <div class="history-container">
      <h3 class="history-title">Calculation History</h3>
      ${entries.length === 0
      ? html`<p class="history-empty">No calculations yet</p>`
      : html`
          <ul class="history-list">
            ${entries.map(entry => html`
              <li class="history-item" @click=${() => onSelectEntry && onSelectEntry(entry)}>
                <div class="history-expression">${entry.expression}</div>
                <div class="history-result">${entry.result}</div>
                <div class="history-timestamp">
                  ${new Date(entry.timestamp).toLocaleTimeString()}
                </div>
              </li>
            `)}
          </ul>
        `}
    </div>
  `;
};

// React component that wraps the Lit component
const History: React.FC<HistoryProps> = ({ entries, onSelectEntry }) => {
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('History entries:', entries);
    if (historyRef.current) {
      render(createHistoryTemplate(entries, onSelectEntry), historyRef.current);
    }
  }, [entries, onSelectEntry]);

  return <div className="calculator-history" ref={historyRef} data-testid="calculator-history"></div>;
};

export default observer(History); 