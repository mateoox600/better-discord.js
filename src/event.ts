import { readdirSync } from "fs";
import { Bot } from "./bot";


export class EventManager {

    constructor(public bot: Bot) {
        if(this.bot.config.eventDir) this.bot.config.eventDir.forEach(this.findEvents);
    }

    /**
     * Private function for recursively finding events in dir 
     * @param dir Full path to events folder
     */
    private findEvents(dir: string) {
        readdirSync(dir, { withFileTypes: true }).forEach((file) => {
            if(file.isDirectory()) this.findEvents(`${dir}/${file.name}`);
            else if(file.name.split('.')[file.name.split('.').length-1]) {
                const event: Event | Event[] = require(`${dir}/${file.name}`);
                if(Array.isArray(event)) event.forEach((e) => this.addEvent(e));
                else this.addEvent(event);
            }
        });
    }

    /**
     * Adding an event to the bot
     */
    public addEvent(event: Event) {
        this.bot.client.on(event.name, event.execute);
    }

    /**
     * Adding multiple events to the bot
     */
    public addEvents(...events: Event[]) {
        events.forEach((event) => this.addEvent(event));
    }

}

export class Event {
    /**
     * @param name The name of the event.
     * @param execute A callback function for the event.
     */
    constructor(public name: string, public execute: (...args: any[]) => void) { }
}