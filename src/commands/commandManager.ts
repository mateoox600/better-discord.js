import { Message } from "discord.js";
import { readdirSync } from "fs";
import { Bot } from '../bot';
import { CommandEvent, createEventData } from './commandEvent';

export class CommandManager {
    
    /**
     * Unique command list.
     */
    public commands: Map<string, Command>;
    /**
     * Command list with aliases reference.
     */
    public executableCommands: Map<string, Command>;

    constructor(public bot: Bot) {
        this.commands = new Map<string, Command>();
        this.executableCommands = new Map<string, Command>();

        if(bot.config.commandDir) bot.config.commandDir.forEach((dir) => this.findCommands(dir));

        this.bot.on('message', (msg) => {
            // 1. Check the message: if it dosn't start by the prefix or if the user is a bot.
            if(!msg.content.startsWith(this.bot.config.prefix) || msg.author.bot) return;

            // 2. Getting the command name and the command.
            const commandName = msg.content.split(/ +/)[0].substring(this.bot.config.prefix.length);
            const command = this.executableCommands.get(commandName);
            if(!command) return;

            // 3. If the command is owner only checking if the user is the owner.
            if(command.ownerOnly && !(msg.author.id in this.bot.config.ownersId)) { msg.reply(`"${commandName}" is a bot owner command`); return; }

            // 4. executing the command
            this.executeCommand(command, msg);
        });
    }

    /**
     * Logger for a command execution (might be moved in a logger class in the futur).
     * @param command The command.
     * @param msg The message that triggered the command.
     */
    private logCommandExecution(command: Command, msg: Message) {
        if(!command.dm) console.log(`Server: ${msg.guild?.name} - ${msg.author.tag}: ${msg.content}`);
        else console.log(`${msg.author.tag}: ${msg.content}`);
    }

    /**
     * Execute the command
     * @param command The command.
     * @param msg The message that triggered the command.
     */
    private executeCommand(command: Command, msg: Message) {
        const eventData: CommandEvent = createEventData(msg, this.bot);
        this.logCommandExecution(command, eventData);
        command.execute(eventData);
    }

    /**
     * Private function for recursively finding commands in dir 
     * @param dir Full path to commands folder
     */
    private findCommands(dir: string) {
        readdirSync(dir, { withFileTypes: true }).forEach((file) => {
            if(file.isDirectory()) this.findCommands(`${dir}/${file.name}`);
            else if(['js', 'ts'].includes(file.name.split('.')[file.name.split('.').length-1])) {
                const command: Command | Command[] = require(`${dir}/${file.name}`);
                if(Array.isArray(command)) command.forEach((cmd) => this.addCommand(cmd));
                else this.addCommand(command);
            }
        });
    }

    /**
     * Adding a command to the bot
     */
    public addCommand(command: Command) {
        this.commands.set(command.name, command);
        this.executableCommands.set(command.name, command);
        command.aliases.forEach((allias) => this.executableCommands.set(allias, command))
    }

    /**
     * Adding multiple commands to the bot
     */
    public addCommands(...commands: Command[]) {
        commands.forEach((command) => this.addCommand(command));
    }

}

export class Command {
    /**
     * @param name The name of the command.
     * @param aliases Aliases of the command name.
     * @param execute A callback that will be executed when the command is executed.
     * @param ownerOnly True means that only the owner can do the command.
     * @param dm If true the command can be done in dm and in normal text channel.
     */
    constructor(public name: string, public aliases: string[], public execute: (e: CommandEvent) => void, public ownerOnly: boolean = false, public dm: boolean = false) { }
}