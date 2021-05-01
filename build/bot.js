"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bot = void 0;
const discord_js_1 = require("discord.js");
const commandManager_1 = require("./commands/commandManager");
const event_1 = require("./event");
class Bot extends discord_js_1.Client {
    constructor(config) {
        super(config.clientConfig);
        this.config = config;
        this.commandManager = new commandManager_1.CommandManager(this);
        this.eventManager = new event_1.EventManager(this);
    }
    /* Discord bot functions */
    async fetchMessage(id, guild) {
        try {
            var lastGiveaway = await (guild === null || guild === void 0 ? void 0 : guild.channels.cache.array().filter((c) => c.type === 'text').map((c) => c).filter(async (c) => {
                try {
                    return (await c.messages.fetch(id)) != null;
                }
                catch (error) {
                    return false;
                }
            })[0].messages.fetch(id));
            return lastGiveaway;
        }
        catch (error) {
            return undefined;
        }
    }
    parseTime(arg) {
        var days = 0, hours = 0, minutes = 0, seconds = 0;
        var match = arg.match(/(\d+)(st|nd|rt|th)/);
        if (match) {
            var day = Number(match[0].substring(0, match.length - 2));
            var currentTime = new Date();
            if (day > new Date(currentTime.getFullYear(), currentTime.getMonth() + 1, 0).getDate())
                day = new Date(currentTime.getFullYear(), currentTime.getMonth() + 1, 0).getDate();
            if (day <= currentTime.getDate()) {
                days = new Date(currentTime.getFullYear(), currentTime.getMonth() + 1, 0).getDate() - currentTime.getDate() + day - 1;
            }
            else {
                days = day - currentTime.getDate() - 1;
            }
            hours = 24 - currentTime.getHours();
            minutes = 60 - currentTime.getMinutes();
            seconds = 60 - currentTime.getSeconds();
        }
        match = arg.match(/\d+d/);
        if (match)
            days += Number(match[0].substring(0, match[0].length - 1));
        match = arg.match(/\d+h/);
        if (match)
            hours += Number(match[0].substring(0, match[0].length - 1));
        match = arg.match(/\d+m/);
        if (match)
            minutes += Number(match[0].substring(0, match[0].length - 1));
        match = arg.match(/\d+s/);
        if (match)
            seconds += Number(match[0].substring(0, match[0].length - 1));
        const totalHours = (days * 24) + hours;
        const totalMinutes = (totalHours * 60) + minutes;
        const totalSeconds = (totalMinutes * 60) + seconds;
        return totalSeconds * 1000;
    }
}
exports.Bot = Bot;
