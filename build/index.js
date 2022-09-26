"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const { Client, GatewayIntentBits, Options, LimitedCollection, Collection } = require('discord.js');
const { prefix } = require('./config.json');
const fs = require('fs');
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates],
    makeCache: manager => {
        if (manager.name === 'MessageManager')
            return new LimitedCollection({ maxSize: 0 });
        return new Collection();
    },
});
const commands = fs.readdirSync('./src/commands').map(x => x.replace('.ts', ''));
client.once('ready', (bot) => {
    console.log(`Ready on ${bot.user.username}`);
});
client.on('messageCreate', (message) => __awaiter(void 0, void 0, void 0, function* () {
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
}));
const token = process.env.TOKEN;
client.login(token);
//# sourceMappingURL=index.js.map