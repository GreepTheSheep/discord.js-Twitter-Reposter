const Discord = require('discord.js')
const Enmap = require('enmap')

async function guildinfo(message, client, config, functiondate, functiontime, publicBot, db, prefix, prefix2, embed) {
    if (message.content.toLowerCase() == prefix + ' guild' || message.content.toLowerCase() == prefix2 + ' guild'){
        const awaitmsg = await message.channel.send('awaitng guild id...')
        var db
        const filter = m => message.author == m.author;
        const collectorguild = message.channel.createMessageCollector(filter, {time: 30000, max: 1});
        collectorguild.on('collect', m => {
            awaitmsg.delete()
            m.delete()
            var gu = client.guilds.find(g=> g.id == m.content)
            if (gu) db = new Enmap({name:'db_'+m.content})
            else if (!gu) db = new Enmap({name:'db_'+message.guild.id})
            message.channel.send(`\`\`\`Guild: ${gu ? gu.id : message.guild.id} - ${gu ? gu.name :  message.guild.name}\nChannel: ${db.has('channel_id') ? db.get('channel_id') + ' - #' + client.channels.get(db.get('channel_id')).name : 'No channel set'}\nShard: ${db.has('shard_id') ? db.get('shard_id') + ` / ${client.shard.count}`: 'Shard data empty'}\nTwitter username: ${db.has('twitter_name') ? '@'+db.get('twitter_name') : 'No name set'}\nRetweet: ${db.get('retweet') ? 'Yes' : 'No'}\nReplies: ${db.get('reply') ? 'Yes' : 'No'}\`\`\``)
            });
        collector4.on('end', (collected, reason) => {
            if (reason == 'time'){
                awaitmsg.delete()
                db = new Enmap({name:'db_'+message.guild.id})
                message.channel.send(`\`\`\`Guild: ${message.guild.id} - ${message.guild.name}\nChannel: ${db.has('channel_id') ? db.get('channel_id') + ' - #' + client.channels.get(db.get('channel_id')).name : 'No channel set'}\nShard: ${db.has('shard_id') ? db.get('shard_id') + ` / ${client.shard.count}`: 'Shard data empty'}\nTwitter username: ${db.has('twitter_name') ? '@'+db.get('twitter_name') : 'No name set'}\nRetweet: ${db.get('retweet') ? 'Yes' : 'No'}\nReplies: ${db.get('reply') ? 'Yes' : 'No'}\`\`\``)
            }
        });
    }
}

module.exports = guildinfo