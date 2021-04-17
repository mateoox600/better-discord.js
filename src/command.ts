import { Message } from "discord.js";
import { readdirSync } from "fs";
import { Bot } from './bot';

export class CommandManager {
    
    public commands: Map<string, Command>;
    public executableCommands: Map<string, Command>;

    constructor(public bot: Bot) {
        this.commands = new Map<string, Command>();
        this.executableCommands = new Map<string, Command>();

        if(bot.config.commandDir) this.findCommands(bot.config.commandDir);

        this.bot.client.on('message', (msg) => {
            if(!msg.content.startsWith(this.bot.config.prefix) || msg.author.bot) return;

            const commandName = msg.content.split(/ +/)[0].substring(this.bot.config.prefix.length);
            var command: Command;
            if(this.executableCommands.has(commandName)) command = this.executableCommands.get(commandName) as Command;
            else return;

            if(!command.dm) console.log(`Server: ${msg.guild?.name} - ${msg.author.tag}: ${msg.content}`);
            else console.log(`${msg.author.tag}: ${msg.content}`);
            if(command.ownerOnly && !(msg.author.id in this.bot.config.ownersId)) { msg.reply(`"${commandName}" is a bot owner command`); return; }

            const args = msg.content.split(/ +/);
            args.shift();
            command.execute(msg, args);
        })
    }

    private findCommands(dir: string) {
        readdirSync(dir, { withFileTypes: true }).forEach((file) => {
            if(file.isDirectory()) this.findCommands(`${dir}/${file.name}`);
            else if(file.name.split('.')[file.name.split('.').length-1]) {
                const command: Command | Command[] = require(`${dir}/${file.name}`);
                if(Array.isArray(command)) command.forEach((cmd) => this.addCommand(cmd));
                else this.addCommand(command);
            }
        });
    }

    public addCommand(command: Command) {
        this.commands.set(command.name, command);
        this.executableCommands.set(command.name, command);
        command.aliases.forEach((allias) => this.executableCommands.set(allias, command))
    }

    public addCommands(...commands: Command[]) {
        commands.forEach((command) => this.addCommand(command));
    }

}

export class Command {
    constructor(public name: string, public aliases: string[], public execute: (e: Message, args: string[]) => void, public ownerOnly: boolean = false, public dm: boolean = false) { }
}