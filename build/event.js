"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = exports.EventManager = void 0;
var fs_1 = require("fs");
var EventManager = /** @class */ (function () {
    function EventManager(bot) {
        this.bot = bot;
        if (this.bot.config.eventDir)
            this.findEvents(this.bot.config.eventDir);
    }
    EventManager.prototype.findEvents = function (dir) {
        var _this = this;
        fs_1.readdirSync(dir, { withFileTypes: true }).forEach(function (file) {
            if (file.isDirectory())
                _this.findEvents(dir + "/" + file.name);
            else if (file.name.split('.')[file.name.split('.').length - 1]) {
                var event_1 = require(dir + "/" + file.name);
                if (Array.isArray(event_1))
                    event_1.forEach(function (e) { return _this.addEvent(e); });
                else
                    _this.addEvent(event_1);
            }
        });
    };
    EventManager.prototype.addEvent = function (event) {
        this.bot.client.on(event.name, event.execute);
    };
    EventManager.prototype.addEvents = function () {
        var _this = this;
        var events = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            events[_i] = arguments[_i];
        }
        events.forEach(function (event) { return _this.addEvent(event); });
    };
    return EventManager;
}());
exports.EventManager = EventManager;
var Event = /** @class */ (function () {
    function Event(name, execute) {
        this.name = name;
        this.execute = execute;
    }
    return Event;
}());
exports.Event = Event;
