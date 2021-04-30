import { writeFileSync, existsSync } from 'fs';

/**
 * The default structure for data.
 */
export interface DataStruct<Key> {
    key: Key
}

export class DataManager<Key, Value extends DataStruct<Key>> extends Map<Key, Value> {

    /**
     * @param name The name of the data file.
     */
    constructor(public name: string, autoSaveTime: number = 5*60*1000) {
        super();
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
        data.forEach((d) => this.set(d.key, d));
    }

    /**
     * Save the data to the file.
     */
    public save() {
        const data: {data: Value[]} = require('./data/' + this.name + '.json');
        data.data = Array.from(this.values())
        writeFileSync(__dirname + '/data/' + this.name + '.json', JSON.stringify(data));
    }

}