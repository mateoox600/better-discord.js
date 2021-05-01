"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = exports.CommandManager = void 0;
const fs_1 = require("fs");
const commandEvent_1 = require("./commandEvent");
class CommandManager {
    constructor(bot) {
        this.bot = bot;
        this.commands = new Map();
        this.executableCommands = new Map();
        if (bot.config.commandDir)
            bot.config.commandDir.forEach((dir) => this.findCommands(dir));
        this.bot.on('message', (msg) => {
            // 1. Check the message: if it dosn't start by the prefix or if the user is a bot.
            if (!msg.content.startsWith(this.bot.config.prefix) || msg.author.bot)
                return;
            // 2. Getting the command name and the command.
            const commandName = msg.content.split(/ +/)[0].substring(this.bot.config.prefix.length);
            const command = this.executableCommands.get(commandName);
            if (!command)
                return;
            // 3. If the command is owner only checking if the user is the owner.
            if (command.ownerOnly && !(msg.author.id in this.bot.config.ownersId)) {
                msg.reply(`"${commandName}" is a bot owner command`);
                return;
            }
            // 4. executing the command
            this.executeCommand(command, msg);
        });
    }
    /**
     * Execute the command
     * @param command The command.
     * @param msg The message that triggered the command.
     */
    executeCommand(command, msg) {
        const eventData = commandEvent_1.createEventData(msg, this.bot);
        this.logCommandExecution(command, eventData);
        command.execute(this.bot, eventData);
    }
    /**
     * Logger for a command execution (might be moved in a logger class in the futur).
     * @param command The command.
     * @param msg The message that triggered the command.
     */
    logCommandExecution(command, msg) {
        var _a;
        if (!(msg.channel.type === 'dm'))
            console.log(`Server: ${(_a = msg.guild) === null || _a === void 0 ? void 0 : _a.name} - ${msg.author.tag}: ${msg.content}`);
        else
            console.log(`${msg.author.tag}: ${msg.content}`);
    }
    /**
     * Private function for recursively finding commands in dir
     * @param dir Full path to commands folder
     */
    findCommands(dir) {
        fs_1.readdirSync(dir, { withFileTypes: true }).forEach((file) => {
            if (file.isDirectory())
                this.findCommands(`${dir}/${file.name}`);
            else if (['js', 'ts'].includes(file.name.split('.')[file.name.split('.').length - 1])) {
                const command = require(`${dir}/${file.name}`);
                if (Array.isArray(command))
                    command.forEach((cmd) => this.addCommand(cmd));
                else
                    this.addCommand(command);
            }
        });
    }
    /**
     * Adding a command to the bot
     */
    addCommand(command) {
        this.commands.set(command.name, command);
        this.executableCommands.set(command.name, command);
        command.aliases.forEach((allias) => this.executableCommands.set(allias, command));
    }
    /**
     * Adding multiple commands to the bot
     */
    addCommands(...commands) {
        commands.forEach((command) => this.addCommand(command));
    }
}
exports.CommandManager = CommandManager;
class Command {
    /**
     * @param name The name of the command.
     * @param aliases Aliases of the command name.
     * @param execute A callback that will be executed when the command is executed.
     * @param ownerOnly True means that only the owner can do the command.
     * @param dm If true the command can be done in dm and in normal text channel.
     */
    constructor(name, aliases, execute, ownerOnly = false, dm = false, customProperties) {
        this.name = name;
        this.aliases = aliases;
        this.execute = execute;
        this.ownerOnly = ownerOnly;
        this.dm = dm;
        this.customProperties = customProperties;
    }
}
exports.Command = Command;
