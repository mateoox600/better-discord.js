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
}
exports.Bot = Bot;
