import { Bot } from "./bot";
export declare class EventManager {
    bot: Bot;
    constructor(bot: Bot);
    /**
     * Private function for recursively finding events in dir
     * @param dir Full path to events folder
     */
    private findEvents;
    /**
     * Adding an event to the bot
     */
    addEvent(event: Event): void;
    /**
     * Adding multiple events to the bot
     */
    addEvents(...events: Event[]): void;
}
export declare class Event {
    name: string;
    execute: (...args: any[]) => void;
    /**
     * @param name The name of the event.
     * @param execute A callback function for the event.
     */
    constructor(name: string, execute: (...args: any[]) => void);
}
