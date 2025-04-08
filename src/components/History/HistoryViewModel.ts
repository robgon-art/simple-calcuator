/**
 * HistoryViewModel - Transforms history data for UI presentation
 */
import { HistoryEntryModel, HistoryModel } from "./HistoryModel";
import { HistoryEntry } from "./types";

/**
 * View properties for the History component
 */
export interface HistoryViewProps {
    entries: HistoryEntry[];
    onSelectEntry: (entry: HistoryEntry) => void;
}

/**
 * Represents the ViewModel for the History component
 */
export interface HistoryViewModel {
    readonly viewProps: HistoryViewProps;
    readonly selectEntry: (entry: HistoryEntry) => void;
    readonly sortedEntries: ReadonlyArray<HistoryEntryModel>;
    readonly isEmpty: boolean;
}

/**
 * Maps a history model entry to a UI history entry
 */
const mapModelEntryToViewEntry = (entry: HistoryEntryModel): HistoryEntry => ({
    expression: entry.expression,
    result: entry.result,
    timestamp: entry.timestamp
});

/**
 * Creates a HistoryViewModel from a HistoryModel
 */
export const createHistoryViewModel = (
    model: HistoryModel,
    onEntrySelected: (entry: HistoryEntryModel) => void
): HistoryViewModel => {
    // Sort entries by timestamp (newest first)
    const sortedEntries = [...model.entries].sort((a, b) => b.timestamp - a.timestamp);

    // Map to UI-ready entries
    const entries = sortedEntries.map(mapModelEntryToViewEntry);

    // Create handler for entry selection
    const selectEntry = (entry: HistoryEntry) => {
        // Find the original model entry
        const modelEntry = model.entries.find(e =>
            e.expression === entry.expression &&
            e.result === entry.result &&
            e.timestamp === entry.timestamp
        );

        if (modelEntry) {
            onEntrySelected(modelEntry);
        }
    };

    return {
        viewProps: {
            entries,
            onSelectEntry: selectEntry
        },
        selectEntry,
        sortedEntries,
        isEmpty: entries.length === 0
    };
}; 