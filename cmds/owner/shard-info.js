const Discord = require('discord.js')

async function shardinfo(message, client, config, functiondate, functiontime, publicBot, db, prefix, prefix2, embed) {
    if (message.content.toLowerCase() == prefix + ' shards' || message.content.toLowerCase() == prefix2 + ' shards'){
            let values = await client.shard.broadcastEval(`
                [
                    this.shard.id,
                    this.guilds.size
                ]
            `);
            var array = [];
            var totalServ = 0
            var totalShardList = 1
            values.forEach((value) => {
                totalServ = totalServ + value[1]
                totalShardList = totalShardList++
                array.push(`• SHARD #${value[0] + 1} | Guilds: ${value[1]}`)
            });
            message.channel.send(`\`\`\`css\n${array.join('\n')}\`\`\`• Total guilds: ${totalServ}. Total shards: ${client.shard.count}${totalShardList == client.shard.count ? ' (all online)' : ` (${totalShardList} online, ${client.shard.count - totalShardList} offline)`}`);
    }
}

module.exports = shardinfo