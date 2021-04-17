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
    /**
     * Client from discord.js
    */
    client: Client;
    commandManager: CommandManager;
    eventManager: EventManager;
    constructor(config: BotOptions);
    login(token: string): void;
    disconnect(): void;
}
