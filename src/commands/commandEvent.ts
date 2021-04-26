import { Message, MessageEmbed } from "discord.js";
import { Bot } from "../bot";

export interface CommandEvent extends Message {
    awaitResponse: (msg: string | MessageEmbed) => Promise<Message>,
    args: string[]
}

export function createEventData(message: Message, bot: Bot): CommandEvent {
    var e  = message as CommandEvent;

    e.awaitResponse = (msg) => {
        message.channel.send(msg);
        return new Promise<Message>((resolve, reject) => {
            var start = Date.now();
            function process(msg: Message) {
                if(Date.now() - start > 2*60*1000) { delEvent(); return; }
                if(msg.author.id === message.author.id && msg.channel.id === message.channel.id) {
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