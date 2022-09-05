import { Client, Message, ChannelType } from 'discord.js';

module.exports = async (client: Client, message: Message) => {
    const guildChannels = await message.guild.channels.fetch();
    let dailyChannel = guildChannels.find(channel => channel.name.toLowerCase() === 'daily');

    if (!dailyChannel) {
        dailyChannel = await message.guild.channels.create({
            name: 'daily',
            type: ChannelType.GuildVoice
        });
    }


    const activeMembers = guildChannels.filter(x => x.type === ChannelType.GuildVoice).map(x => x.members);
    activeMembers.forEach(members => {
        members.forEach(member => {
            member.voice.setChannel(dailyChannel.id);
        })
    })
};