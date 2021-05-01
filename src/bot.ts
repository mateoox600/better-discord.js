import { Client, ClientOptions, Guild, Message, Snowflake, TextChannel } from 'discord.js';
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

export class Bot extends Client {

    public commandManager: CommandManager;
    public eventManager: EventManager;

    constructor(public config: BotOptions) {
        super(config.clientConfig);
        this.commandManager = new CommandManager(this);
        this.eventManager = new EventManager(this);
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

    public parseTime(arg: string): number {
        var days = 0, hours = 0, minutes = 0, seconds = 0;
        var match = arg.match(/(\d+)(st|nd|rt|th)/);
        if (match) {
            var day = Number(match[0].substring(0, match.length - 2));
            var currentTime = new Date();
            if (day > new Date(currentTime.getFullYear(), currentTime.getMonth() + 1, 0).getDate()) day = new Date(currentTime.getFullYear(), currentTime.getMonth() + 1, 0).getDate();
            if (day <= currentTime.getDate()) {
                days = new Date(currentTime.getFullYear(), currentTime.getMonth() + 1, 0).getDate() - currentTime.getDate() + day - 1;
            } else {
                days = day - currentTime.getDate() - 1;
            }
            hours = 24 - currentTime.getHours();
            minutes = 60 - currentTime.getMinutes();
            seconds = 60 - currentTime.getSeconds();
        }

        match = arg.match(/\d+d/);
        if (match) days += Number(match[0].substring(0, match[0].length - 1))
        match = arg.match(/\d+h/);
        if (match) hours += Number(match[0].substring(0, match[0].length - 1))
        match = arg.match(/\d+m/);
        if (match) minutes += Number(match[0].substring(0, match[0].length - 1))
        match = arg.match(/\d+s/);
        if (match) seconds += Number(match[0].substring(0, match[0].length - 1))

        const totalHours = (days * 24) + hours;
        const totalMinutes = (totalHours * 60) + minutes;
        const totalSeconds = (totalMinutes * 60) + seconds;

        return totalSeconds * 1000;
    }

}