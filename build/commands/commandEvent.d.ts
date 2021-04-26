import { Message, MessageEmbed } from "discord.js";
import { Bot } from "../bot";
export interface CommandEvent extends Message {
    awaitResponse: (msg: string | MessageEmbed) => Promise<Message>;
    args: string[];
}
export declare function createEventData(message: Message, bot: Bot): CommandEvent;
