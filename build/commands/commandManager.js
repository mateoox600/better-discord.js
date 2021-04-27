"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = exports.CommandManager = void 0;
var fs_1 = require("fs");
var commandEvent_1 = require("./commandEvent");
var CommandManager = /** @class */ (function () {
    function CommandManager(bot) {
        var _this = this;
        this.bot = bot;
        this.commands = new Map();
        this.executableCommands = new Map();
        if (bot.config.commandDir)
            bot.config.commandDir.forEach(this.findCommands);
        this.bot.client.on('message', function (msg) {
            // 1. Check the message: if it dosn't start by the prefix or if the user is a bot.
            if (!msg.content.startsWith(_this.bot.config.prefix) || msg.author.bot)
                return;
            // 2. Getting the command name and the command.
            var commandName = msg.content.split(/ +/)[0].substring(_this.bot.config.prefix.length);
            var command = _this.executableCommands.get(commandName);
            if (!command)
                return;
            // 3. If the command is owner only checking if the user is the owner.
            if (command.ownerOnly && !(msg.author.id in _this.bot.config.ownersId)) {
                msg.reply("\"" + commandName + "\" is a bot owner command");
                return;
            }
            // 4. executing the command
            _this.executeCommand(command, msg);
        });
    }
    /**
     * Logger for a command execution (might be moved in a logger class in the futur).
     * @param command The command.
     * @param msg The message that triggered the command.
     */
    CommandManager.prototype.logCommandExecution = function (command, msg) {
        var _a;
        if (!command.dm)
            console.log("Server: " + ((_a = msg.guild) === null || _a === void 0 ? void 0 : _a.name) + " - " + msg.author.tag + ": " + msg.content);
        else
            console.log(msg.author.tag + ": " + msg.content);
    };
    /**
     * Execute the command
     * @param command The command.
     * @param msg The message that triggered the command.
     */
    CommandManager.prototype.executeCommand = function (command, msg) {
        var eventData = commandEvent_1.createEventData(msg, this.bot);
        this.logCommandExecution(command, eventData);
        command.execute(eventData);
    };
    /**
     * Private function for recursively finding commands in dir
     * @param dir Full path to commands folder
     */
    CommandManager.prototype.findCommands = function (dir) {
        var _this = this;
        fs_1.readdirSync(dir, { withFileTypes: true }).forEach(function (file) {
            if (file.isDirectory())
                _this.findCommands(dir + "/" + file.name);
            else if (file.name.split('.')[file.name.split('.').length - 1] in ['js', 'ts']) {
                var command = require(dir + "/" + file.name);
                if (Array.isArray(command))
                    command.forEach(function (cmd) { return _this.addCommand(cmd); });
                else
                    _this.addCommand(command);
            }
        });
    };
    /**
     * Adding a command to the bot
     */
    CommandManager.prototype.addCommand = function (command) {
        var _this = this;
        this.commands.set(command.name, command);
        this.executableCommands.set(command.name, command);
        command.aliases.forEach(function (allias) { return _this.executableCommands.set(allias, command); });
    };
    /**
     * Adding multiple commands to the bot
     */
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
    /**
     * @param name The name of the command.
     * @param aliases Aliases of the command name.
     * @param execute A callback that will be executed when the command is executed.
     * @param ownerOnly True means that only the owner can do the command.
     * @param dm If true the command can be done in dm and in normal text channel.
     */
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
