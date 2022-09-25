import { Client, Message, ChannelType, User } from 'discord.js';
import { myCache } from '../services/CacheService';

module.exports = async (client: Client, message: Message) => {

    console.log('rodando', message.guildId);

    const guild = await message.guild?.fetch();

    const usersByChannel = myCache.take(message.guildId);
    console.log(usersByChannel);


    if (usersByChannel.length == 0)
        return;

    const guildChannels = await guild?.channels.fetch();
    const canais = guildChannels?.filter(x => x.type === ChannelType.GuildVoice);

    const members = canais?.map(c => c.members.map(c => c));

    members?.forEach(member => {

        member.forEach(m => {
            let old_channel = (<Array<{ member: string, channel_id: string }>>usersByChannel).find(u => u.member === m.id)

            if (old_channel) {
                try{
                m.voice.setChannel(old_channel.channel_id);
                }
                catch(err){
                    console.log(err);
                }
            }
        });
    });
};