import { Message } from "discord.js";
import { Bot } from './bot';
export declare class CommandManager {
    bot: Bot;
    commands: Map<string, Command>;
    executableCommands: Map<string, Command>;
    constructor(bot: Bot);
    private findCommands;
    addCommand(command: Command): void;
    addCommands(...commands: Command[]): void;
}
export declare class Command {
    name: string;
    aliases: string[];
    execute: (e: Message, args: string[]) => void;
    ownerOnly: boolean;
    dm: boolean;
    constructor(name: string, aliases: string[], execute: (e: Message, args: string[]) => void, ownerOnly?: boolean, dm?: boolean);
}
