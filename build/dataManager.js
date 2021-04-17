"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataManager = void 0;
var fs_1 = require("fs");
var DataManager = /** @class */ (function () {
    function DataManager(name) {
        var _this = this;
        this.name = name;
        this.data = new Map();
        if (!fs_1.existsSync(__dirname + '/data/' + this.name + '.json'))
            fs_1.writeFileSync(__dirname + '/data/' + this.name + '.json', '{"data":[]}');
        this.load();
        setInterval(function () {
            console.log('Auto Save Data: ', _this.name);
            _this.save();
        }, 5 * 60 * 1000);
    }
    DataManager.prototype.load = function () {
        var _this = this;
        var data = require('./data/' + this.name + '.json').data;
        data.forEach(function (d) { return _this.data.set(d.key, d); });
    };
    DataManager.prototype.save = function () {
        var data = require('./data/' + this.name + '.json');
        data.data = Array.from(this.data.values());
        fs_1.writeFileSync(__dirname + '/data/' + this.name + '.json', JSON.stringify(data));
    };
    DataManager.prototype.get = function (id) {
        return this.data.get(id);
    };
    DataManager.prototype.set = function (id, value) {
        this.data.set(id, value);
    };
    return DataManager;
}());
exports.DataManager = DataManager;
