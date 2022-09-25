import { Client, Message, ChannelType, User, GuildMember, GuildChannel } from 'discord.js';
import { myCache } from '../services/CacheService';

function reduce(arr): [] {
    return arr.reduce(function (a, b) {
        return a.concat(b);
    });
}

module.exports = async (client: Client, message: Message) => {
    console.log('rodando');
    await message.guild?.members.fetch();

    const tasks = (await message.guild?.channels.fetch())?.map(async c => {
        return await c.fetch(true)        
    });

    const guildChannels: GuildChannel[] = await Promise.all(tasks ?? []);


    
    let dailyChannel = guildChannels?.find(channel => channel.name.toLowerCase() === 'daily');

    if (!dailyChannel) {
        dailyChannel = await message?.guild?.channels.create({
            name: 'daily',
            type: ChannelType.GuildVoice
        });
    }


    const canais = guildChannels?.filter(x => x.type === ChannelType.GuildVoice && x.members.size > 0);

    let usersByChannel: { member: string, member_name: string, channel_id: string | null, channel_name: string | undefined }[] = [];


    console.log(canais?.map(c => c).length);

    const members = reduce(canais?.map(c => {
        return c.members.map(m => ({
            member: m,
            channel_id: c.id,
            channel_name: c.name,
            roles: JSON.stringify(m.roles.cache.find(f=>f.name == 'dev'))
        }))
    })) as { member: GuildMember, channel_id: string, channel_name: string }[];

    
    console.log('membros', members);
};