import { Bot } from "./bot";
export declare class EventManager {
    bot: Bot;
    constructor(bot: Bot);
    private findEvents;
    addEvent(event: Event): void;
    addEvents(...events: Event[]): void;
}
export declare class Event {
    name: string;
    execute: (...args: any[]) => void;
    constructor(name: string, execute: (...args: any[]) => void);
}
