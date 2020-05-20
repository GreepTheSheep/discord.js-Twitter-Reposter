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
            message.channel.send(`\`\`\`Premium: ${db.get('premium')}\nShard ${db.get('shard_id')}\n\n${db.get('twitter_name')}\`\`\``)
            });
        collector4.on('end', (collected, reason) => {
            if (reason == 'time'){
                awaitmsg.delete()
                db = new Enmap({name:'db_'+message.guild.id})
                message.channel.send(`\`\`\`Premium: ${db.get('premium')}\nShard ${db.get('shard_id')}\n\n${db.get('twitter_name')}\`\`\``)
            }
        });
    }
}

module.exports = guildinfo