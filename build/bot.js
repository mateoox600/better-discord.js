"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bot = void 0;
var discord_js_1 = require("discord.js");
var commandManager_1 = require("./commands/commandManager");
var event_1 = require("./event");
var Bot = /** @class */ (function () {
    function Bot(config) {
        this.config = config;
        this.client = new discord_js_1.Client(this.config.clientConfig);
        this.commandManager = new commandManager_1.CommandManager(this);
        this.eventManager = new event_1.EventManager(this);
    }
    /* Discord bot functions */
    /**
     * Connect the bot to discord
     * @param token Discord bot token
     */
    Bot.prototype.login = function (token) {
        this.client.login(token);
    };
    /**
     * Disconnect the bot
     */
    Bot.prototype.disconnect = function () {
        this.client.destroy();
    };
    return Bot;
}());
exports.Bot = Bot;
