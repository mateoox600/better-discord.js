import { Message } from "discord.js";
export declare class Command {
    name: string;
    aliases: string[];
    execute: (e: Message, args: string[]) => void;
    ownerOnly: boolean;
    dm: boolean;
    constructor(name: string, aliases: string[], execute: (e: Message, args: string[]) => void, ownerOnly?: boolean, dm?: boolean);
}
