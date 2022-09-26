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
const CacheService_1 = require("../services/CacheService");
module.exports = (client, message) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log('rodando', message.guildId);
    const guild = yield ((_a = message.guild) === null || _a === void 0 ? void 0 : _a.fetch());
    const usersByChannel = CacheService_1.myCache.take(message.guildId);
    console.log(usersByChannel);
    if (usersByChannel.length == 0)
        return;
    const guildChannels = yield (guild === null || guild === void 0 ? void 0 : guild.channels.fetch());
    const canais = guildChannels === null || guildChannels === void 0 ? void 0 : guildChannels.filter(x => x.type === discord_js_1.ChannelType.GuildVoice);
    const members = canais === null || canais === void 0 ? void 0 : canais.map(c => c.members.map(c => c));
    members === null || members === void 0 ? void 0 : members.forEach(member => {
        member.forEach(m => {
            let old_channel = usersByChannel.find(u => u.member === m.id);
            if (old_channel) {
                try {
                    m.voice.setChannel(old_channel.channel_id);
                }
                catch (err) {
                    console.log(err);
                }
            }
        });
    });
});
//# sourceMappingURL=enddaily.js.map