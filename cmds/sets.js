/*
    Settings after OOBE
    Version 3 of MyTweets (Greep)
*/
const Discord = require('discord.js')

async function settings(message, client, config, functiondate, functiontime, publicBot, db, prefix, prefix2, embed) {   
    if (message.content.toLowerCase() == prefix + ' reset' || message.content.toLowerCase() == prefix2 + ' reset'){
        if(message.member.hasPermission("ADMINISTRATOR") || message.member.id == config.owner_id){
            db.deleteAll()
            message.channel.send(`The server database has been deleted, the bot is ready for a new setup`)
        } else return
    }
}

module.exports = settings