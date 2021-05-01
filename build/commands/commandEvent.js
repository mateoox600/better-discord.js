"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEventData = void 0;
function createEventData(message, bot) {
    var e = message;
    e.args = message.content.split(/ +/).slice(1);
    e.awaitResponse = (msg, time = 2 * 60 * 1000, filter = () => { return true; }) => {
        message.channel.send(msg);
        return new Promise((resolve, reject) => {
            var start = Date.now();
            function process(msg) {
                if (Date.now() - start > time) {
                    delEvent();
                    reject('no response');
                }
                if (msg.author.id === message.author.id && msg.channel.id === message.channel.id && filter(msg))
                    resolve(createEventData(msg, bot));
            }
            var e = bot.on('message', process);
            function delEvent() { e.removeListener('message', process); }
        });
    };
    return e;
}
exports.createEventData = createEventData;
