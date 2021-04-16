import { Snowflake } from 'discord.js';
import { Bot, Command, DataManager, DataStruct, Event } from '../build/index';

const bot = new Bot({
    prefix: 'f!',
    ownersId: [ '251978573139673088' ]
});

interface Test extends DataStruct<Snowflake> {
    text: string
}

const data = new DataManager<Snowflake, Test>('data');

bot.addEvent(new Event('ready', () => {
    console.log('ete');
}));

bot.addCommand(new Command('get', [], (e, args) => {
    e.reply(JSON.stringify(data.get(e.author.id)));
}));

bot.addCommand(new Command('set', [], (e, args) => {
    data.set(e.author.id, {
        key: e.author.id,
        text: args[0]
    })
}));

bot.addCommand(new Command('save', [], (e, args) => {
    data.save();
}));

bot.login('TOKEN');