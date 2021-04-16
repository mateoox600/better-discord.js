import { Client, ClientOptions } from 'discord.js';
import { readdirSync } from 'fs';
import { Command } from './command';
import { Event } from './event';

export interface BotOptions {
    prefix: string,
    ownersId: string[],
    commandDir?: string,
    eventDir?: string,
    clientConfig?: ClientOptions
}

export class Bot {

    public client: Client;
    public commands: Map<string, Command> = new Map<string, Command>();
    public executableCommands: Map<string, Command> = new Map<string, Command>();

    constructor(public config: BotOptions) {
        this.client = new Client(this.config.clientConfig);
        if(config.commandDir) this.findCommands(config.commandDir);
        if(config.eventDir) this.findCommands(config.eventDir);

        this.client.on('message', (msg) => {
            if(!msg.content.startsWith(this.config.prefix) || msg.author.bot) return;

            const commandName = msg.content.split(/ +/)[0].substring(config.prefix.length);
            var command: Command;
            if(this.executableCommands.has(commandName)) command = this.executableCommands.get(commandName) as Command;
            else return;

            if(!command.dm) console.log(`Server: ${msg.guild?.name} - ${msg.author.tag}: ${msg.content}`);
            else console.log(`${msg.author.tag}: ${msg.content}`);
            if(command.ownerOnly && !(msg.author.id in this.config.ownersId)) { msg.reply(`"${commandName}" is a bot owner command`); return; }

            const args = msg.content.split(/ +/);
            args.shift();
            command.execute(msg, args);
        })
    }

    /*--- Commands ---*/

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

    /*--- Events ---*/

    private findEvents(dir: string) {
        readdirSync(dir, { withFileTypes: true }).forEach((file) => {
            if(file.isDirectory()) this.findEvents(`${dir}/${file.name}`);
            else if(file.name.split('.')[file.name.split('.').length-1]) {
                const event: Event | Event[] = require(`${dir}/${file.name}`);
                if(Array.isArray(event)) event.forEach((e) => this.addEvent(e));
                else this.addEvent(event);
            }
        });
    }

    public addEvent(event: Event) {
        this.client.on(event.name, event.execute);
    }

    public addEvents(...events: Event[]) {
        events.forEach((event) => this.addEvent(event));
    }

    /* Discord bot functions */

    public login(token: string) {
        this.client.login(token);
    }

    public disconnect() {
        this.client.destroy();
    }

}