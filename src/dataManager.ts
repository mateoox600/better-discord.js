import { writeFileSync, existsSync } from 'fs';

/**
 * The default structure for data.
 */
export interface DataStruct<Key> {
    id: Key
}

export class DataManager<Key, Value extends DataStruct<Key>> {

    /**
     * The map that stores all the data.
     */
    private data: Map<Key, Value> = new Map<Key, Value>();

    /**
     * @param name The name of the data file.
     */
    constructor(public name: string) {
        if(!existsSync(__dirname + '/data/' + this.name + '.json')) writeFileSync(__dirname + '/data/' + this.name + '.json', '{"data":[]}');
        this.load();
        setInterval(() => {
            console.log('Auto Save Data: ', this.name);
            this.save();
        }, 5*60*1000);
    }

    /**
     * Load the data from the file.
     */
    private load() {
        const data: Value[] = require('./data/' + this.name + '.json').data;
        data.forEach((d) => this.data.set(d.id, d));
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
     * @param id The id of the value.
     * @returns Returns the value or undefined if the value is not found.
     */
    public get(id: Key) {
        return this.data.get(id);
    }

    /**
     * Set the value to the id. (fail if the id and the id in the value are not the same)
     * @param id The id of the value.
     * @param value The value.
     */
    public set(id: Key, value: Value) {
        if(id !== value.id) return;
        this.data.set(id, value);
    }

}