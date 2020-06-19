const Discord = require('discord.js')
const shell = require('shelljs')

function enable_send(message, client, config, functiondate, functiontime, publicBot, db, prefix, prefix2, embed, twit_send) {
    if (message.content.toLowerCase() == prefix + ' maintenance' || message.content.toLowerCase() == prefix2 + ' maintenance'){
        if (twit_send == false){
            twit_send = true
            message.reply(`Maintenance is disabled. Bot will send tweets`)
        } else {
            twit_send = false
            message.reply(`Maintenance is enabled. Bot will not send tweets`)
        }
    }
}

module.exports = enable_send