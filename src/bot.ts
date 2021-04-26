import { Client, ClientOptions } from 'discord.js';
import { CommandManager } from './commands/commandManager';
import { EventManager } from './event';

/**
 * Structure of the bot options
 */
export interface BotOptions {
    /**
     * Prefix used by the command manager
     */
    prefix: string,
    /**
     * The discord id of the bot owner(s)
     */
    ownersId: string[],
    /**
     *The full path to the command folder
     */
    commandDir?: string[],
    /**
     * The full path to the event folder
     */
    eventDir?: string[],
    /**
     * ClientOptions from discord.js
     */
    clientConfig?: ClientOptions
}

export class Bot {

    /**
     * Client from discord.js
     */
    public client: Client;
    public commandManager: CommandManager;
    public eventManager: EventManager;

    constructor(public config: BotOptions) {
        this.client = new Client(this.config.clientConfig);
        this.commandManager = new CommandManager(this);
        this.eventManager = new EventManager(this);
    }

    /* Discord bot functions */

    /**
     * Connect the bot to discord
     * @param token Discord bot token
     */
    public login(token: string) {
        this.client.login(token);
    }

    /**
     * Disconnect the bot
     */
    public disconnect() {
        this.client.destroy();
    }

}