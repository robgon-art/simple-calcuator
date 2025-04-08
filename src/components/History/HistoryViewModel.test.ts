import { describe, it, expect, vi } from 'vitest';
import { createHistoryViewModel } from './HistoryViewModel';
import { createHistoryModel, createHistoryEntry } from './HistoryModel';
import { HistoryEntry } from './types';

describe('HistoryViewModel', () => {
    describe('createHistoryViewModel', () => {
        it('should create a view model with sorted entries', () => {
            // Create entries with different timestamps
            const entry1 = createHistoryEntry('1 + 1', '2', 1000);
            const entry2 = createHistoryEntry('2 + 2', '4', 2000); // Most recent
            const entry3 = createHistoryEntry('3 + 3', '6', 500);  // Oldest

            // Create a model with the entries
            const model = createHistoryModel([entry1, entry2, entry3]);

            // Mock the selection handler
            const onEntrySelected = vi.fn();

            // Create the view model
            const viewModel = createHistoryViewModel(model, onEntrySelected);

            // Verify entries are sorted by timestamp (newest first)
            expect(viewModel.sortedEntries.length).toBe(3);
            expect(viewModel.sortedEntries[0]).toBe(entry2); // Most recent first
            expect(viewModel.sortedEntries[1]).toBe(entry1);
            expect(viewModel.sortedEntries[2]).toBe(entry3); // Oldest last

            // Verify isEmpty property
            expect(viewModel.isEmpty).toBe(false);

            // Verify viewProps has correct entries
            expect(viewModel.viewProps.entries.length).toBe(3);
            expect(viewModel.viewProps.entries[0].expression).toBe('2 + 2');
            expect(viewModel.viewProps.entries[0].result).toBe('4');
        });

        it('should handle empty history', () => {
            const model = createHistoryModel();
            const onEntrySelected = vi.fn();

            const viewModel = createHistoryViewModel(model, onEntrySelected);

            expect(viewModel.sortedEntries.length).toBe(0);
            expect(viewModel.isEmpty).toBe(true);
            expect(viewModel.viewProps.entries.length).toBe(0);
        });

        it('should call onEntrySelected when an entry is selected', () => {
            // Create a single entry
            const entry = createHistoryEntry('1 + 1', '2', 1000);
            const model = createHistoryModel([entry]);

            // Mock the selection handler
            const onEntrySelected = vi.fn();

            // Create the view model
            const viewModel = createHistoryViewModel(model, onEntrySelected);

            // Create a UI entry matching the model entry
            const uiEntry: HistoryEntry = {
                expression: '1 + 1',
                result: '2',
                timestamp: 1000
            };

            // Call the selection handler
            viewModel.selectEntry(uiEntry);

            // Verify the handler was called with the model entry
            expect(onEntrySelected).toHaveBeenCalledWith(entry);
        });

        it('should not call onEntrySelected if entry not found', () => {
            const entry = createHistoryEntry('1 + 1', '2', 1000);
            const model = createHistoryModel([entry]);
            const onEntrySelected = vi.fn();

            const viewModel = createHistoryViewModel(model, onEntrySelected);

            // Create a UI entry that doesn't match any model entry
            const uiEntry: HistoryEntry = {
                expression: 'not found',
                result: 'nope',
                timestamp: 9999
            };

            viewModel.selectEntry(uiEntry);

            // The handler should not be called
            expect(onEntrySelected).not.toHaveBeenCalled();
        });
    });
}); 