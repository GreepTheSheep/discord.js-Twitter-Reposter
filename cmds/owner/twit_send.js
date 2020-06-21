const Discord = require('discord.js')
const shell = require('shelljs')

function enable_send(message, client, config, functiondate, functiontime, publicBot, db, prefix, prefix2, embed, twit_send) {
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
}

module.exports = enable_send