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
        Bot.instance = this;
        this.commandManager = new commandManager_1.CommandManager(this);
        this.eventManager = new event_1.EventManager(this);
        this.dataManagers = new Map();
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
    /**
     * Convert a time string ('1h25s', '6th') in millis
     * @param arg time in string ('1h25s', '6th')
     * @returns time in millis to arg
     */
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
    humanizeDate(date) {
        return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    }
    humanizeMillisTime(millis) {
        var days = Math.floor(millis / (24 * 60 * 60 * 1000));
        millis -= days * (24 * 60 * 60 * 1000);
        var hours = Math.floor(millis / (60 * 60 * 1000));
        millis -= hours * (60 * 60 * 1000);
        var minutes = Math.floor(millis / (60 * 1000));
        millis -= minutes * (60 * 1000);
        var seconds = Math.floor(millis / 1000);
        millis -= seconds * 1000;
        return (days > 0 ? `${days} day` + (days > 1 ? 's' : '') : '') + ' ' + (hours > 0 ? `${hours} hour` + (hours > 1 ? 's' : '') : '') + ' ' + (minutes > 0 ? `${minutes} minute` + (minutes > 1 ? 's' : '') : '') + ' ' + (seconds > 0 ? `${seconds} second` + (seconds > 1 ? 's' : '') : '');
    }
}
exports.Bot = Bot;
