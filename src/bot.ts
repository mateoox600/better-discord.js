import { Client, ClientOptions } from 'discord.js';
import { CommandManager } from './command';
import { EventManager } from './event';

export interface BotOptions {
    prefix: string,
    ownersId: string[],
    commandDir?: string,
    eventDir?: string,
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

    public login(token: string) {
        this.client.login(token);
    }

    public disconnect() {
        this.client.destroy();
    }

}