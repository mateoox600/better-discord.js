"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataManager = void 0;
var fs_1 = require("fs");
var DataManager = /** @class */ (function () {
    /**
     * @param name The name of the data file.
     */
    function DataManager(name) {
        var _this = this;
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
        }, 5 * 60 * 1000);
    }
    /**
     * Load the data from the file.
     */
    DataManager.prototype.load = function () {
        var _this = this;
        var data = require('./data/' + this.name + '.json').data;
        data.forEach(function (d) { return _this.data.set(d.id, d); });
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
     * @param id The id of the value.
     * @returns Returns the value or undefined if the value is not found.
     */
    DataManager.prototype.get = function (id) {
        return this.data.get(id);
    };
    /**
     * Set the value to the id. (fail if the id and the id in the value are not the same)
     * @param id The id of the value.
     * @param value The value.
     */
    DataManager.prototype.set = function (id, value) {
        if (id !== value.id)
            return;
        this.data.set(id, value);
    };
    return DataManager;
}());
exports.DataManager = DataManager;
