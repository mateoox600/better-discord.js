"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = exports.EventManager = void 0;
const fs_1 = require("fs");
class EventManager {
    constructor(bot) {
        this.bot = bot;
        if (this.bot.config.eventDir)
            this.bot.config.eventDir.forEach((dir) => this.findEvents(dir));
    }
    /**
     * Private function for recursively finding events in dir
     * @param dir Full path to events folder
     */
    findEvents(dir) {
        fs_1.readdirSync(dir, { withFileTypes: true }).forEach((file) => {
            if (file.isDirectory())
                this.findEvents(`${dir}/${file.name}`);
            else if (['js', 'ts'].includes(file.name.split('.')[file.name.split('.').length - 1])) {
                const event = require(`${dir}/${file.name}`);
                if (Array.isArray(event))
                    event.forEach((e) => this.addEvent(e));
                else
                    this.addEvent(event);
            }
        });
    }
    /**
     * Adding an event to the bot
     */
    addEvent(event) {
        this.bot.on(event.name, (...args) => event.execute(this.bot, args));
    }
    /**
     * Adding multiple events to the bot
     */
    addEvents(...events) {
        events.forEach((event) => this.addEvent(event));
    }
}
exports.EventManager = EventManager;
class Event {
    /**
     * @param name The name of the event.
     * @param execute A callback function for the event.
     */
    constructor(name, execute) {
        this.name = name;
        this.execute = execute;
    }
}
exports.Event = Event;
