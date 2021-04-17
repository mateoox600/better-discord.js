"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = exports.CommandManager = void 0;
var fs_1 = require("fs");
var CommandManager = /** @class */ (function () {
    function CommandManager(bot) {
        var _this = this;
        this.bot = bot;
        this.commands = new Map();
        this.executableCommands = new Map();
        if (bot.config.commandDir)
            this.findCommands(bot.config.commandDir);
        this.bot.client.on('message', function (msg) {
            var _a;
            if (!msg.content.startsWith(_this.bot.config.prefix) || msg.author.bot)
                return;
            var commandName = msg.content.split(/ +/)[0].substring(_this.bot.config.prefix.length);
            var command;
            if (_this.executableCommands.has(commandName))
                command = _this.executableCommands.get(commandName);
            else
                return;
            if (!command.dm)
                console.log("Server: " + ((_a = msg.guild) === null || _a === void 0 ? void 0 : _a.name) + " - " + msg.author.tag + ": " + msg.content);
            else
                console.log(msg.author.tag + ": " + msg.content);
            if (command.ownerOnly && !(msg.author.id in _this.bot.config.ownersId)) {
                msg.reply("\"" + commandName + "\" is a bot owner command");
                return;
            }
            var args = msg.content.split(/ +/);
            args.shift();
            command.execute(msg, args);
        });
    }
    CommandManager.prototype.findCommands = function (dir) {
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
    CommandManager.prototype.addCommand = function (command) {
        var _this = this;
        this.commands.set(command.name, command);
        this.executableCommands.set(command.name, command);
        command.aliases.forEach(function (allias) { return _this.executableCommands.set(allias, command); });
    };
    CommandManager.prototype.addCommands = function () {
        var _this = this;
        var commands = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            commands[_i] = arguments[_i];
        }
        commands.forEach(function (command) { return _this.addCommand(command); });
    };
    return CommandManager;
}());
exports.CommandManager = CommandManager;
var Command = /** @class */ (function () {
    function Command(name, aliases, execute, ownerOnly, dm) {
        if (ownerOnly === void 0) { ownerOnly = false; }
        if (dm === void 0) { dm = false; }
        this.name = name;
        this.aliases = aliases;
        this.execute = execute;
        this.ownerOnly = ownerOnly;
        this.dm = dm;
    }
    return Command;
}());
exports.Command = Command;
