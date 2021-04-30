/**
 * The default structure for data.
 */
export interface DataStruct<Key> {
    key: Key;
}
export declare class DataManager<Key, Value extends DataStruct<Key>> extends Map<Key, Value> {
    name: string;
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
}
