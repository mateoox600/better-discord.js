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
    awaitResponse(msg: string | MessageEmbed, time: number, filter: (msg: Message) => boolean): Promise<Message>,
    /**
     * Commands args
     */
    args: string[]
}

export function createEventData(message: Message, bot: Bot): CommandEvent {
    var e  = message as CommandEvent;

    e.awaitResponse = (msg, time = 2*60*1000, filter = () => { return true; }) => {
        message.channel.send(msg);
        return new Promise<Message>((resolve, reject) => {
            var start = Date.now();
            function process(msg: Message) {
                if(Date.now() - start > time) { delEvent(); reject('no response'); }
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