import { Message, MessageEmbed } from "discord.js";
import { Bot } from "../bot";
/**
 * The event that passed when a command execute
 */
export interface CommandEvent extends Message {
    /**
     * Await a response to the msg
     * @param msg The message to send to wait the response
     * @param filter A filter for messages
     */
    awaitResponse(msg: string | MessageEmbed, time: number, filter?: (msg: Message) => boolean): Promise<Message>;
    /**
     * Commands args
     */
    args: string[];
}
export declare function createEventData(message: Message, bot: Bot): CommandEvent;
