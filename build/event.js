"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = exports.EventManager = void 0;
var fs_1 = require("fs");
var EventManager = /** @class */ (function () {
    function EventManager(bot) {
        var _this = this;
        this.bot = bot;
        if (this.bot.config.eventDir)
            this.bot.config.eventDir.forEach(function (dir) { return _this.findEvents(dir); });
    }
    /**
     * Private function for recursively finding events in dir
     * @param dir Full path to events folder
     */
    EventManager.prototype.findEvents = function (dir) {
        var _this = this;
        fs_1.readdirSync(dir, { withFileTypes: true }).forEach(function (file) {
            if (file.isDirectory())
                _this.findEvents(dir + "/" + file.name);
            else if (file.name.split('.')[file.name.split('.').length - 1] in ['js', 'ts']) {
                var event_1 = require(dir + "/" + file.name);
                if (Array.isArray(event_1))
                    event_1.forEach(function (e) { return _this.addEvent(e); });
                else
                    _this.addEvent(event_1);
            }
        });
    };
    /**
     * Adding an event to the bot
     */
    EventManager.prototype.addEvent = function (event) {
        var _this = this;
        this.bot.client.on(event.name, function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return event.execute(_this.bot, args);
        });
    };
    /**
     * Adding multiple events to the bot
     */
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
    /**
     * @param name The name of the event.
     * @param execute A callback function for the event.
     */
    function Event(name, execute) {
        this.name = name;
        this.execute = execute;
    }
    return Event;
}());
exports.Event = Event;
