import { Message } from 'discord.js';

const { Client, GatewayIntentBits } = require('discord.js');
const { token, prefix } = require('./config.json');
const fs = require('fs');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });


const commands = fs.readdirSync('./commands').map(x => x.replace('.ts', ''));


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

    const execute = require(`./commands/${cmd}.ts`);
    execute(client, message);
});

client.login(token);