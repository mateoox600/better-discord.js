"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEventData = void 0;
function createEventData(message, bot) {
    var e = message;
    e.awaitResponse = function (msg) {
        message.channel.send(msg);
        return new Promise(function (resolve, reject) {
            var start = Date.now();
            function process(msg) {
                if (Date.now() - start > 2 * 60 * 1000) {
                    delEvent();
                    return;
                }
                if (msg.author.id === message.author.id && msg.channel.id === message.channel.id) {
                    resolve(msg);
                }
            }
            var e = bot.client.on('message', process);
            function delEvent() { e.removeListener('message', process); }
        });
    };
    e.args = message.content.split(/ +/);
    return e;
}
exports.createEventData = createEventData;
