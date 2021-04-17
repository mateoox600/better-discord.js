export interface DataStruct<Key> {
    id: Key;
}
export declare class DataManager<Key, Value extends DataStruct<Key>> {
    name: string;
    private data;
    /**
     * @param name The name of the data file.
     */
    constructor(name: string);
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
     * @param id The id of the value.
     * @returns Returns the value or undefined if the value is not found.
     */
    get(id: Key): Value | undefined;
    /**
     * Set the value to the id. (fail if the id and the id in the value are not the same)
     * @param id The id of the value.
     * @param value The value.
     */
    set(id: Key, value: Value): void;
}
