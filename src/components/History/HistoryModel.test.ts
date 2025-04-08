import { describe, it, expect, vi } from 'vitest';
import {
    createHistoryEntry,
    createHistoryModel,
    addHistoryEntry,
    addToHistory,
    clearHistory
} from './HistoryModel';

describe('HistoryModel', () => {
    describe('createHistoryEntry', () => {
        it('should create an entry with the provided expression and result', () => {
            const timestamp = Date.now();
            const entry = createHistoryEntry('1 + 2', '3', timestamp);

            expect(entry.expression).toBe('1 + 2');
            expect(entry.result).toBe('3');
            expect(entry.timestamp).toBe(timestamp);
        });

        it('should use current timestamp if not provided', () => {
            // Mock Date.now() to return a fixed timestamp
            const mockNow = 1234567890;
            const originalNow = Date.now;
            Date.now = vi.fn(() => mockNow);

            const entry = createHistoryEntry('1 + 2', '3');

            expect(entry.timestamp).toBe(mockNow);

            // Restore original Date.now
            Date.now = originalNow;
        });
    });

    describe('createHistoryModel', () => {
        it('should create a model with the provided entries', () => {
            const entries = [
                createHistoryEntry('1 + 2', '3'),
                createHistoryEntry('4 * 5', '20')
            ];

            const model = createHistoryModel(entries);

            expect(model.entries).toEqual(entries);
        });

        it('should create an empty model if no entries provided', () => {
            const model = createHistoryModel();

            expect(model.entries).toEqual([]);
        });
    });

    describe('addHistoryEntry', () => {
        it('should add an entry to the model and return a new model', () => {
            const initialModel = createHistoryModel();
            const newEntry = createHistoryEntry('5 - 3', '2');

            const updatedModel = addHistoryEntry(initialModel, newEntry);

            // Check that the entry was added
            expect(updatedModel.entries.length).toBe(1);
            expect(updatedModel.entries[0]).toBe(newEntry);

            // Verify immutability - original model should be unchanged
            expect(initialModel.entries.length).toBe(0);
        });

        it('should append entry to existing entries', () => {
            const entry1 = createHistoryEntry('1 + 1', '2');
            const initialModel = createHistoryModel([entry1]);
            const entry2 = createHistoryEntry('3 * 4', '12');

            const updatedModel = addHistoryEntry(initialModel, entry2);

            // Check that the entry was appended
            expect(updatedModel.entries.length).toBe(2);
            expect(updatedModel.entries[0]).toBe(entry1);
            expect(updatedModel.entries[1]).toBe(entry2);
        });
    });

    describe('addToHistory', () => {
        it('should create an entry and add it to the model', () => {
            // Mock Date.now() to return a fixed timestamp
            const mockNow = 1234567890;
            const originalNow = Date.now;
            Date.now = vi.fn(() => mockNow);

            const initialModel = createHistoryModel();
            const updatedModel = addToHistory(initialModel, '2 + 3', '5');

            // Verify the entry was added with correct values
            expect(updatedModel.entries.length).toBe(1);
            expect(updatedModel.entries[0].expression).toBe('2 + 3');
            expect(updatedModel.entries[0].result).toBe('5');
            expect(updatedModel.entries[0].timestamp).toBe(mockNow);

            // Restore original Date.now
            Date.now = originalNow;
        });
    });

    describe('clearHistory', () => {
        it('should return a new empty model', () => {
            const entries = [
                createHistoryEntry('1 + 2', '3'),
                createHistoryEntry('4 * 5', '20')
            ];

            const model = createHistoryModel(entries);
            const clearedModel = clearHistory();

            expect(clearedModel.entries.length).toBe(0);

            // Original model should be unaffected
            expect(model.entries.length).toBe(2);
        });
    });
}); 