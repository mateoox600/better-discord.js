import { Client, ClientOptions, Guild, Message, Snowflake, TextChannel } from 'discord.js';
import { Command, CommandManager } from './commands/commandManager';
import { DataManager, DataStruct } from './dataManager';
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

export class Bot extends Client {

    public static instance: Bot;

    public commandManager: CommandManager;
    public eventManager: EventManager;
    public dataManagers: Map<string, DataManager<any, any>>;

    constructor(public config: BotOptions) {
        super(config.clientConfig);
        Bot.instance = this;
        this.commandManager = new CommandManager(this);
        this.eventManager = new EventManager(this);
        this.dataManagers = new Map();
    }

    /* Discord bot functions */

    public async fetchMessage(id: Snowflake, guild: Guild) {
        try {
            var lastGiveaway = await guild?.channels.cache.array().filter((c) => c.type === 'text').map((c) => c as TextChannel).filter(async (c) => {
                try {
                    return (await c.messages.fetch(id)) != null
                } catch (error) { return false; }
            })[0].messages.fetch(id) as Message;
            return lastGiveaway;
        } catch (error) {
            return undefined;
        }
    }

}