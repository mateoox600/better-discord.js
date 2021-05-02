import { Client, ClientOptions, Guild, Message, Snowflake } from 'discord.js';
import { CommandManager } from './commands/commandManager';
import { DataManager } from './dataManager';
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
export declare class Bot extends Client {
    config: BotOptions;
    static instance: Bot;
    commandManager: CommandManager;
    eventManager: EventManager;
    dataManagers: Map<string, DataManager<any, any>>;
    constructor(config: BotOptions);
    fetchMessage(id: Snowflake, guild: Guild): Promise<Message | undefined>;
}
