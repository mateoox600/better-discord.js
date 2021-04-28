import { Client, ClientOptions, Guild, Message, Snowflake } from 'discord.js';
import { CommandManager } from './commands/commandManager';
import { EventManager } from './event';
/**
 * Structure of the bot options
 */
export interface BotOptions {
    /**
     * Prefix used by the command manager
     */
    prefix: string;
    /**
     * The discord id of the bot owner(s)
     */
    ownersId: string[];
    /**
     *The full path to the command folder
     */
    commandDir?: string[];
    /**
     * The full path to the event folder
     */
    eventDir?: string[];
    /**
     * ClientOptions from discord.js
     */
    clientConfig?: ClientOptions;
}
export declare class Bot {
    config: BotOptions;
    /**
     * Client from discord.js
     */
    client: Client;
    commandManager: CommandManager;
    eventManager: EventManager;
    constructor(config: BotOptions);
    fetchMessage(id: Snowflake, guild: Guild): Promise<Message | undefined>;
    /**
     * Connect the bot to discord
     * @param token Discord bot token
     */
    login(token: string): void;
    /**
     * Disconnect the bot
     */
    disconnect(): void;
}
