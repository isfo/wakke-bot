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
const discord_js_1 = require("discord.js");
function reduce(arr) {
    return arr.reduce(function (a, b) {
        return a.concat(b);
    });
}
module.exports = (client, message) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    console.log('rodando');
    yield ((_a = message.guild) === null || _a === void 0 ? void 0 : _a.members.fetch());
    const tasks = (_c = (yield ((_b = message.guild) === null || _b === void 0 ? void 0 : _b.channels.fetch()))) === null || _c === void 0 ? void 0 : _c.map((c) => __awaiter(void 0, void 0, void 0, function* () {
        return yield c.fetch(true);
    }));
    const guildChannels = yield Promise.all(tasks !== null && tasks !== void 0 ? tasks : []);
    let dailyChannel = guildChannels === null || guildChannels === void 0 ? void 0 : guildChannels.find(channel => channel.name.toLowerCase() === 'daily');
    if (!dailyChannel) {
        dailyChannel = yield ((_d = message === null || message === void 0 ? void 0 : message.guild) === null || _d === void 0 ? void 0 : _d.channels.create({
            name: 'daily',
            type: discord_js_1.ChannelType.GuildVoice
        }));
    }
    const canais = guildChannels === null || guildChannels === void 0 ? void 0 : guildChannels.filter(x => x.type === discord_js_1.ChannelType.GuildVoice && x.members.size > 0);
    let usersByChannel = [];
    console.log(canais === null || canais === void 0 ? void 0 : canais.map(c => c).length);
    const members = reduce(canais === null || canais === void 0 ? void 0 : canais.map(c => {
        return c.members.map(m => ({
            member: m,
            channel_id: c.id,
            channel_name: c.name,
            roles: JSON.stringify(m.roles.cache.find(f => f.name == 'dev'))
        }));
    }));
    console.log('membros', members);
});
//# sourceMappingURL=teste.js.map