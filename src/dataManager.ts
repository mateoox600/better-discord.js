import { writeFileSync, existsSync } from 'fs';

export interface DataStruct<Key> {
    key: Key
}

export class DataManager<Key, Value extends DataStruct<any>> {

    private data: Map<Key, Value> = new Map<Key, Value>();

    constructor(public name: string) {
        if(!existsSync(__dirname + '/data/' + this.name + '.json')) writeFileSync(__dirname + '/data/' + this.name + '.json', '{"data":[]}');
        this.load();
        setInterval(() => {
            console.log('Auto Save Data: ', this.name);
            this.save();
        }, 5*60*1000);
    }

    private load() {
        const data: Value[] = require('./data/' + this.name + '.json').data;
        data.forEach((d) => this.data.set(d.key, d));
    }

    public save() {
        const data: {data: Value[]} = require('./data/' + this.name + '.json');
        data.data = Array.from(this.data.values())
        writeFileSync(__dirname + '/data/' + this.name + '.json', JSON.stringify(data));
    }

    public get(id: Key) {
        return this.data.get(id);
    }

    public set(id: Key, value: Value) {
        this.data.set(id, value);
    }

}