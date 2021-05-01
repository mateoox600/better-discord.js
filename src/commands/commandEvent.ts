import { Message, MessageEmbed } from "discord.js";
import { Bot } from "../bot";

/**
 * The event that passed when a command execute
 */
export interface CommandEvent extends Message {
    /**
     * Commands args
     */
    args: string[],
    /**
     * Await a response to the msg
     * @param msg The message to send to wait the response
     * @param filter A filter for messages
     */
    awaitResponse(msg: string | MessageEmbed, time: number, filter?: (msg: Message) => boolean): Promise<Message>
}

export function createEventData(message: Message, bot: Bot): CommandEvent {
    var e = message as CommandEvent;

    e.args = message.content.split(/ +/).slice(1);
    e.awaitResponse = (msg, time = 2*60*1000, filter = () => { return true; }) => {
        message.channel.send(msg);
        return new Promise<CommandEvent>((resolve, reject) => {
            var start = Date.now();
            function process(msg: Message) {
                if(Date.now() - start > time) { delEvent(); reject('no response'); }
                if(msg.author.id === message.author.id && msg.channel.id === message.channel.id && filter(msg)) resolve(createEventData(msg, bot));
            }
            var e = bot.on('message', process);
            function delEvent() { e.removeListener('message', process) }
        });
    };

    return e;
}