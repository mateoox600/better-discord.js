"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataManager = void 0;
const fs_1 = require("fs");
class DataManager extends Map {
    /**
     * @param name The name of the data file.
     */
    constructor(name, autoSaveTime = 5 * 60 * 1000) {
        super();
        this.name = name;
        if (!fs_1.existsSync(__dirname + '/data/' + this.name + '.json'))
            fs_1.writeFileSync(__dirname + '/data/' + this.name + '.json', '{"data":[]}');
        this.load();
        setInterval(() => {
            console.log('Auto Save Data: ', this.name);
            this.save();
        }, autoSaveTime);
    }
    /**
     * Load the data from the file.
     */
    load() {
        const data = require('./data/' + this.name + '.json').data;
        data.forEach((d) => this.set(d.key, d));
    }
    /**
     * Save the data to the file.
     */
    save() {
        const data = require('./data/' + this.name + '.json');
        data.data = Array.from(this.values());
        fs_1.writeFileSync(__dirname + '/data/' + this.name + '.json', JSON.stringify(data));
    }
}
exports.DataManager = DataManager;
