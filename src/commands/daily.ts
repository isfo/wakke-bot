import { Client, Message, ChannelType, User, GuildMember, GuildChannel } from 'discord.js';
import { stringify } from 'querystring';
import { myCache } from '../services/CacheService';

function reduce(arr): [] {
    return arr.reduce(function (a, b) {
        return a.concat(b);
    });
}

const tagRole = 'dev';
const roomName = 'daily';

module.exports = async (client: Client, message: Message) => {
    await message.guild?.members.fetch();

    const tasks = (await message.guild?.channels.fetch())?.map(async c => {
        return await c.fetch(true)        
    });

    const guildChannels: GuildChannel[] = await Promise.all(tasks ?? []);

    let dailyChannel = guildChannels?.find(channel => channel.name.toLowerCase() === roomName);

    if (!dailyChannel) {
        dailyChannel = await message?.guild?.channels.create({
            name: roomName,
            type: ChannelType.GuildVoice
        });
    }

    const canais = guildChannels?.filter(x => x.type === ChannelType.GuildVoice && x.members.size > 0);

    let usersByChannel: { member: string, member_name: string, channel_id: string | null, channel_name: string | undefined }[] = [];

    const members = reduce(canais?.map(c => {
        return c.members.map(m => ({
            member: m,
            channel_id: c.id,
            channel_name: c.name,
            roles: JSON.stringify(m.roles.cache.find(f=>f.name == tagRole))
        })).filter(f=> f.roles)
    })) as { member: GuildMember, channel_id: string, channel_name: string }[];

    if (members.length == 0)
    {
        message.channel.send(`Nenhum usuário com a tag '${tagRole}' foi encontrado`);
        return;
    }

    const usernames = members?.map(m => m.member.user.username).join(', ');

    message.channel.send("Movendo usuários: " + usernames);

    members?.forEach(c => {
        usersByChannel.push({
            member: c.member.id,
            member_name: c.member.user.username,
            channel_id: c.channel_id,
            channel_name: c.channel_name
        })

        if (dailyChannel) {
            c.member.voice.setChannel(dailyChannel.id)
        }
    });

    myCache.set(message.guildId, usersByChannel);
};