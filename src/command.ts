import { Message } from "discord.js";

export class Command {
    constructor(public name: string, public aliases: string[], public execute: (e: Message, args: string[]) => void, public ownerOnly: boolean = false, public dm: boolean = false) { }
}