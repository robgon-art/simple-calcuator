/**
 * HistoryModel - Immutable model for calculation history
 */

/**
 * Represents a single history entry
 */
export interface HistoryEntryModel {
    readonly expression: string;
    readonly result: string;
    readonly timestamp: number;
}

/**
 * Creates a new history entry
 */
export const createHistoryEntry = (
    expression: string,
    result: string,
    timestamp: number = Date.now()
): HistoryEntryModel => ({
    expression,
    result,
    timestamp
});

/**
 * Collection of history entries
 */
export interface HistoryModel {
    readonly entries: ReadonlyArray<HistoryEntryModel>;
}

/**
 * Creates a new history model
 */
export const createHistoryModel = (
    entries: ReadonlyArray<HistoryEntryModel> = []
): HistoryModel => ({
    entries
});

/**
 * Adds an entry to history and returns a new model
 */
export const addHistoryEntry = (
    model: HistoryModel,
    entry: HistoryEntryModel
): HistoryModel => ({
    entries: [...model.entries, entry]
});

/**
 * Adds an entry to history using the provided parameters
 */
export const addToHistory = (
    model: HistoryModel,
    expression: string,
    result: string
): HistoryModel =>
    addHistoryEntry(model, createHistoryEntry(expression, result));

/**
 * Clears all history entries
 */
export const clearHistory = (): HistoryModel => createHistoryModel(); 