"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEventData = void 0;
function createEventData(message, bot) {
    var e = message;
    e.awaitResponse = function (msg, time, filter) {
        if (time === void 0) { time = 2 * 60 * 1000; }
        if (filter === void 0) { filter = function () { return true; }; }
        message.channel.send(msg);
        return new Promise(function (resolve, reject) {
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
    e.args = message.content.split(/ +/).slice(1);
    return e;
}
exports.createEventData = createEventData;
