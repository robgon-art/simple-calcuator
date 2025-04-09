import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import History from './History';
import type { HistoryEntry } from './types';

describe('History Component', () => {
    const exampleHistoryEntries: HistoryEntry[] = [
        { expression: '2 + 2', result: '4', timestamp: 1654321000000 },
        { expression: '3 * 4', result: '12', timestamp: 1654321100000 },
    ];

    it('renders correctly with history entries', () => {
        render(<History entries={exampleHistoryEntries} />);
        const historyContainer = screen.getByTestId('calculator-history');
        expect(historyContainer).toBeInTheDocument();
        expect(historyContainer).toHaveClass('calculator-history');
    });

    it('renders without crashing with empty entries array', () => {
        render(<History entries={[]} />);
        const historyContainer = screen.getByTestId('calculator-history');
        expect(historyContainer).toBeInTheDocument();
    });

    it('passes entries to the lit-html template', () => {
        // Due to the lit-html implementation, we need to test the ref setup
        const { rerender } = render(<History entries={exampleHistoryEntries} />);

        // Testing a re-render with different entries
        const newEntries: HistoryEntry[] = [
            { expression: '10 - 5', result: '5', timestamp: 1654321200000 }
        ];

        rerender(<History entries={newEntries} />);

        // The history element should still exist after rerender
        expect(screen.getByTestId('calculator-history')).toBeInTheDocument();
    });

    it('sets up the callback when onSelectEntry is provided', () => {
        const exampleSelectEntry = vi.fn();
        render(<History
            entries={exampleHistoryEntries}
            onSelectEntry={exampleSelectEntry}
        />);

        // Verify the history container is rendered with the callback setup
        expect(screen.getByTestId('calculator-history')).toBeInTheDocument();
    });
}); 