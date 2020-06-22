const Discord = require('discord.js')
const shell = require('shelljs')

async function enable_send(message, client, config, functiondate, functiontime, publicBot, db, prefix, prefix2, embed, twit_send, authorised_guilds_in_maintenance) {
    if (message.content.toLowerCase() == prefix + ' maintenance' || message.content.toLowerCase() == prefix2 + ' maintenance'){
        if (twit_send == false){
            twit_send = true
            message.reply(`Maintenance is disabled. Bot will send tweets`)
            client.user.setStatus('online')
            client.user.setActivity(`✅ Exiting MAINTENANCE mode`, { type: 'WATCHING' })
            client.shard.send(`Shard ${client.shard.id + 1} - Maintenance disabled`)
        } else {
            twit_send = false
            message.reply(`Maintenance is enabled. Bot will not send tweets`)
            client.user.setStatus('dnd')
            client.user.setActivity(`🟠 Starting MAINTENANCE mode`, { type: 'WATCHING' })
            client.shard.send(`Shard ${client.shard.id + 1} - Maintenance enabled`)
        }
    }
    if (message.content.toLowerCase() == prefix + ' auth' || message.content.toLowerCase() == prefix2 + ' auth'){
        if (twit_send == false){
            const awaitmsg = await message.channel.send('awaitng guild id...')
            const filter = m => message.author == m.author;
            const collectorguild = message.channel.createMessageCollector(filter, {time: 30000, max: 1});
            collectorguild.on('collect', m => {
                var gu = client.guilds.some(g=> g.id == m.content)
                if (gu) {
                    if (authorised_guilds_in_maintenance.includes(m.content)){
                        var n = 0
                        authorised_guilds_in_maintenance.forEach(guild=>{
                            if (guild == m.content){
                                authorised_guilds_in_maintenance.splice(n,1)
                                message.channel.send(`Guild deleted.`)
                                return
                            }
                            n++
                        })
                    }
                    else {
                        authorised_guilds_in_maintenance.push(m.content)
                        message.channel.send(`Guild added.`)
                    }
                }
                else if (!gu) return m.react('❌')
                });
            collectorguild.on('end', (collected, reason) => {
                if (reason == 'time'){
                    message.reply('time\'s up')
                }
            });
        } else {
            message.reply(`Maintenance is disabled. I can't`)
        }
    }
}

module.exports = enable_send