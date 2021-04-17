import { Client, ClientOptions } from 'discord.js';
import { CommandManager } from './command';
import { EventManager } from './event';
export interface BotOptions {
    prefix: string;
    ownersId: string[];
    commandDir?: string;
    eventDir?: string;
    /**
     * ClientOptions from discord.js
    */
    clientConfig?: ClientOptions;
}
export declare class Bot {
    config: BotOptions;
    client: Client;
    commandManager: CommandManager;
    eventManager: EventManager;
    constructor(config: BotOptions);
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
