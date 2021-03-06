import { Bot } from '../bot';
import { CommandEvent } from './commandEvent';
export declare class CommandManager {
    bot: Bot;
    /**
     * Unique command list.
     */
    commands: Map<string, Command>;
    /**
     * Command list with aliases reference.
     */
    executableCommands: Map<string, Command>;
    constructor(bot: Bot);
    /**
     * Execute the command
     * @param command The command.
     * @param msg The message that triggered the command.
     */
    private executeCommand;
    /**
     * Logger for a command execution (might be moved in a logger class in the futur).
     * @param command The command.
     * @param msg The message that triggered the command.
     */
    private logCommandExecution;
    /**
     * Private function for recursively finding commands in dir
     * @param dir Full path to commands folder
     */
    private findCommands;
    /**
     * Adding a command to the bot
     */
    addCommand(command: Command): void;
    /**
     * Adding multiple commands to the bot
     */
    addCommands(...commands: Command[]): void;
}
export declare class Command {
    name: string;
    aliases: string[];
    execute: (client: Bot, e: CommandEvent) => void;
    ownerOnly: boolean;
    dm: boolean;
    customProperties?: {
        [key: string]: any;
    } | undefined;
    /**
     * @param name The name of the command.
     * @param aliases Aliases of the command name.
     * @param execute A callback that will be executed when the command is executed.
     * @param ownerOnly True means that only the owner can do the command.
     * @param dm If true the command can be done in dm and in normal text channel.
     */
    constructor(name: string, aliases: string[], execute: (client: Bot, e: CommandEvent) => void, ownerOnly?: boolean, dm?: boolean, customProperties?: {
        [key: string]: any;
    } | undefined);
}
