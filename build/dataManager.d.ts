/**
 * The default structure for data.
 */
export interface DataStruct<Key> {
    key: Key;
}
export declare class DataManager<Key, Value extends DataStruct<Key>> {
    name: string;
    /**
     * The map that stores all the data.
     */
    private data;
    /**
     * @param name The name of the data file.
     */
    constructor(name: string, autoSaveTime?: number);
    /**
     * Load the data from the file.
     */
    private load;
    /**
     * Save the data to the file.
     */
    save(): void;
    /**
     * Set a data from the map.
     * @param key The key of the value.
     * @returns Returns the value or undefined if the value is not found.
     */
    get(key: Key): Value | undefined;
    /**
     * Set the value to the key. (fail if the key and the key in the value are not the same).
     * @param key The key of the value.
     * @param value The value.
     */
    set(key: Key, value: Value): void;
    /**
     * Check if the key exist.
     * @param key The key of a value.
     * @returns If the value exist.
     */
    has(key: Key): boolean;
}
