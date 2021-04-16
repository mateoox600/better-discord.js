export interface DataStruct<Key> {
    key: Key;
}
export declare class DataManager<Key, Value extends DataStruct<any>> {
    name: string;
    private data;
    constructor(name: string);
    private load;
    save(): void;
    get(id: Key): Value | undefined;
    set(id: Key, value: Value): void;
}
