import { Message, MessageEmbed } from "discord.js";
import { Bot } from "../bot";

/**
 * The event that passed when a command execute
 */
export interface CommandEvent extends Message {
    /**
     * Await a response to the msg
     */
    awaitResponse: (msg: string | MessageEmbed, filter: (msg: Message) => boolean) => Promise<Message>,
    /**
     * Commands args
     */
    args: string[]
}

export function createEventData(message: Message, bot: Bot): CommandEvent {
    var e  = message as CommandEvent;

    e.awaitResponse = (msg, filter = () => { return true; }) => {
        message.channel.send(msg);
        return new Promise<Message>((resolve, reject) => {
            var start = Date.now();
            function process(msg: Message) {
                if(Date.now() - start > 2*60*1000) { delEvent(); return; }
                if(msg.author.id === message.author.id && msg.channel.id === message.channel.id && filter(msg)) {
                    resolve(msg);
                }
            }
            var e = bot.client.on('message', process);
            function delEvent() { e.removeListener('message', process) }
        });
    };
    e.args = message.content.split(/ +/);

    return e;
}