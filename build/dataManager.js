"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataManager = void 0;
var fs_1 = require("fs");
var DataManager = /** @class */ (function () {
    /**
     * @param name The name of the data file.
     */
    function DataManager(name, autoSaveTime) {
        var _this = this;
        if (autoSaveTime === void 0) { autoSaveTime = 5 * 60 * 1000; }
        this.name = name;
        /**
         * The map that stores all the data.
         */
        this.data = new Map();
        if (!fs_1.existsSync(__dirname + '/data/' + this.name + '.json'))
            fs_1.writeFileSync(__dirname + '/data/' + this.name + '.json', '{"data":[]}');
        this.load();
        setInterval(function () {
            console.log('Auto Save Data: ', _this.name);
            _this.save();
        }, autoSaveTime);
    }
    /**
     * Load the data from the file.
     */
    DataManager.prototype.load = function () {
        var _this = this;
        var data = require('./data/' + this.name + '.json').data;
        data.forEach(function (d) { return _this.data.set(d.key, d); });
    };
    /**
     * Save the data to the file.
     */
    DataManager.prototype.save = function () {
        var data = require('./data/' + this.name + '.json');
        data.data = Array.from(this.data.values());
        fs_1.writeFileSync(__dirname + '/data/' + this.name + '.json', JSON.stringify(data));
    };
    /**
     * Set a data from the map.
     * @param key The key of the value.
     * @returns Returns the value or undefined if the value is not found.
     */
    DataManager.prototype.get = function (key) {
        return this.data.get(key);
    };
    /**
     * Set the value to the key. (fail if the key and the key in the value are not the same).
     * @param key The key of the value.
     * @param value The value.
     */
    DataManager.prototype.set = function (key, value) {
        if (key !== value.key)
            return;
        this.data.set(key, value);
    };
    /**
     * Check if the key exist.
     * @param key The key of a value.
     * @returns If the value exist.
     */
    DataManager.prototype.has = function (key) {
        return this.data.has(key);
    };
    return DataManager;
}());
exports.DataManager = DataManager;
