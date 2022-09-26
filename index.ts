import { Message } from 'discord.js';
import { myCache } from './src/services/CacheService';

require('dotenv').config()
const { Client, GatewayIntentBits, Options, LimitedCollection, Collection } = require('discord.js');
const { prefix } = require('./config.json');
const fs = require('fs');

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates],
    makeCache: manager => {
		if (manager.name === 'MessageManager') return new LimitedCollection({ maxSize: 0 });
		return new Collection();
	},
});


const commands = fs.readdirSync('./src/commands').map(x => x.replace('.ts', ''));


client.once('ready', (bot) => {
    console.log(`Ready on ${bot.user.username}`);
});

client.on('messageCreate', async (message: Message) => {
    const content = message.content.split(/\s+/g);
    let command = content.shift();

    if (!command.startsWith(prefix)) {
        return;
    }

    command = command.replace(prefix, '');

    const cmd = commands.find(c => c === command);
    if (!cmd) {
        return;
    }

    const execute = require(`./src/commands/${cmd}.ts`);
    execute(client, message);
});

const token = process.env.TOKEN;
client.login(token);