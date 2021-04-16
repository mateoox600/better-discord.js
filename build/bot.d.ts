import { Client, ClientOptions } from 'discord.js';
import { Command } from './command';
import { Event } from './event';
export interface BotOptions {
    prefix: string;
    ownersId: string[];
    commandDir?: string;
    eventDir?: string;
    clientConfig?: ClientOptions;
}
export declare class Bot {
    config: BotOptions;
    client: Client;
    commands: Map<string, Command>;
    executableCommands: Map<string, Command>;
    constructor(config: BotOptions);
    private findCommands;
    addCommand(command: Command): void;
    addCommands(...commands: Command[]): void;
    private findEvents;
    addEvent(event: Event): void;
    addEvents(...events: Event[]): void;
    login(token: string): void;
    disconnect(): void;
}
