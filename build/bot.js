"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bot = void 0;
var discord_js_1 = require("discord.js");
var fs_1 = require("fs");
var Bot = /** @class */ (function () {
    function Bot(config) {
        var _this = this;
        this.config = config;
        this.commands = new Map();
        this.executableCommands = new Map();
        this.client = new discord_js_1.Client(this.config.clientConfig);
        if (config.commandDir)
            this.findCommands(config.commandDir);
        if (config.eventDir)
            this.findCommands(config.eventDir);
        this.client.on('message', function (msg) {
            var _a;
            if (!msg.content.startsWith(_this.config.prefix) || msg.author.bot)
                return;
            var commandName = msg.content.split(/ +/)[0].substring(config.prefix.length);
            var command;
            if (_this.executableCommands.has(commandName))
                command = _this.executableCommands.get(commandName);
            else
                return;
            if (!command.dm)
                console.log("Server: " + ((_a = msg.guild) === null || _a === void 0 ? void 0 : _a.name) + " - " + msg.author.tag + ": " + msg.content);
            else
                console.log(msg.author.tag + ": " + msg.content);
            if (command.ownerOnly && !(msg.author.id in _this.config.ownersId)) {
                msg.reply("\"" + commandName + "\" is a bot owner command");
                return;
            }
            var args = msg.content.split(/ +/);
            args.shift();
            command.execute(msg, args);
        });
    }
    /*--- Commands ---*/
    Bot.prototype.findCommands = function (dir) {
        var _this = this;
        fs_1.readdirSync(dir, { withFileTypes: true }).forEach(function (file) {
            if (file.isDirectory())
                _this.findCommands(dir + "/" + file.name);
            else if (file.name.split('.')[file.name.split('.').length - 1]) {
                var command = require(dir + "/" + file.name);
                if (Array.isArray(command))
                    command.forEach(function (cmd) { return _this.addCommand(cmd); });
                else
                    _this.addCommand(command);
            }
        });
    };
    Bot.prototype.addCommand = function (command) {
        var _this = this;
        this.commands.set(command.name, command);
        this.executableCommands.set(command.name, command);
        command.aliases.forEach(function (allias) { return _this.executableCommands.set(allias, command); });
    };
    Bot.prototype.addCommands = function () {
        var _this = this;
        var commands = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            commands[_i] = arguments[_i];
        }
        commands.forEach(function (command) { return _this.addCommand(command); });
    };
    /*--- Events ---*/
    Bot.prototype.findEvents = function (dir) {
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
    Bot.prototype.addEvent = function (event) {
        this.client.on(event.name, event.execute);
    };
    Bot.prototype.addEvents = function () {
        var _this = this;
        var events = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            events[_i] = arguments[_i];
        }
        events.forEach(function (event) { return _this.addEvent(event); });
    };
    /* Discord bot functions */
    Bot.prototype.login = function (token) {
        this.client.login(token);
    };
    Bot.prototype.disconnect = function () {
        this.client.destroy();
    };
    return Bot;
}());
exports.Bot = Bot;
