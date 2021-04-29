import { writeFileSync, existsSync } from 'fs';

/**
 * The default structure for data.
 */
export interface DataStruct<Key> {
    key: Key
}

export class DataManager<Key, Value extends DataStruct<Key>> {

    /**
     * The map that stores all the data.
     */
    private data: Map<Key, Value> = new Map<Key, Value>();

    /**
     * @param name The name of the data file.
     */
    constructor(public name: string, autoSaveTime: number = 5*60*1000) {
        if(!existsSync(__dirname + '/data/' + this.name + '.json')) writeFileSync(__dirname + '/data/' + this.name + '.json', '{"data":[]}');
        this.load();
        setInterval(() => {
            console.log('Auto Save Data: ', this.name);
            this.save();
        }, autoSaveTime);
    }

    /**
     * Load the data from the file.
     */
    private load() {
        const data: Value[] = require('./data/' + this.name + '.json').data;
        data.forEach((d) => this.data.set(d.key, d));
    }

    /**
     * Save the data to the file.
     */
    public save() {
        const data: {data: Value[]} = require('./data/' + this.name + '.json');
        data.data = Array.from(this.data.values())
        writeFileSync(__dirname + '/data/' + this.name + '.json', JSON.stringify(data));
    }

    /**
     * Set a data from the map.
     * @param key The key of the value.
     * @returns Returns the value or undefined if the value is not found.
     */
    public get(key: Key) {
        return this.data.get(key);
    }

    /**
     * Set the value to the key. (fail if the key and the key in the value are not the same).
     * @param key The key of the value.
     * @param value The value.
     */
    public set(key: Key, value: Value) {
        if(key !== value.key) return;
        this.data.set(key, value);
    }

    /**
     * Check if the key exist.
     * @param key The key of a value.
     * @returns If the value exist.
     */
    public has(key: Key) {
        return this.data.has(key);
    }

}