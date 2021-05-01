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

    /**
     * Convert a time string ('1h25s', '6th') in millis
     * @param arg time in string ('1h25s', '6th')
     * @returns time in millis to arg
     */
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

    public humanizeDate(date: Date): string {
        return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    }

    public humanizeMillisTime(millis: number): string {
        var days = Math.floor(millis / (24 * 60 * 60 * 1000));
        millis -= days * (24 * 60 * 60 * 1000);
        var hours = Math.floor(millis / (60 * 60 * 1000));
        millis -= hours * (60 * 60 * 1000);
        var minutes = Math.floor(millis / (60 * 1000));
        millis -= minutes * (60 * 1000);
        var seconds = Math.floor(millis / 1000);
        millis -= seconds * 1000;
        return (days > 0 ? `${days} day` + (days > 1 ? 's' : '') : '') + ' ' + (hours > 0 ? `${hours} hour` + (hours > 1 ? 's' : '') : '') + ' ' + (minutes > 0 ? `${minutes} minute` + (minutes > 1 ? 's' : '') : '') + ' ' + (seconds > 0 ? `${seconds} second` + (seconds > 1 ? 's' : '') : '');
    }

}