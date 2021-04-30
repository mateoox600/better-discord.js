"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataManager = void 0;
var fs_1 = require("fs");
var DataManager = /** @class */ (function (_super) {
    __extends(DataManager, _super);
    /**
     * @param name The name of the data file.
     */
    function DataManager(name, autoSaveTime) {
        if (autoSaveTime === void 0) { autoSaveTime = 5 * 60 * 1000; }
        var _this = _super.call(this) || this;
        _this.name = name;
        if (!fs_1.existsSync(__dirname + '/data/' + _this.name + '.json'))
            fs_1.writeFileSync(__dirname + '/data/' + _this.name + '.json', '{"data":[]}');
        _this.load();
        setInterval(function () {
            console.log('Auto Save Data: ', _this.name);
            _this.save();
        }, autoSaveTime);
        return _this;
    }
    /**
     * Load the data from the file.
     */
    DataManager.prototype.load = function () {
        var _this = this;
        var data = require('./data/' + this.name + '.json').data;
        data.forEach(function (d) { return _this.set(d.key, d); });
    };
    /**
     * Save the data to the file.
     */
    DataManager.prototype.save = function () {
        var data = require('./data/' + this.name + '.json');
        data.data = Array.from(this.values());
        fs_1.writeFileSync(__dirname + '/data/' + this.name + '.json', JSON.stringify(data));
    };
    return DataManager;
}(Map));
exports.DataManager = DataManager;
