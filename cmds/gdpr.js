const Discord = require('discord.js')
const Enmap = require('enmap')
const fs = require('fs')

async function gdpr(message, client, config, functiondate, functiontime, publicBot, db, prefix, prefix2, embed){
    if (message.content.toLowerCase().startsWith(prefix + ' gdpr') || message.content.toLowerCase().startsWith(prefi2 + ' gdpr')) {
        if(message.member.hasPermission("ADMINISTRATOR") || message.member.id == config.owner_id){
            db = new Enmap({name:'db_'+message.guild.id})
            var gdpr_data = `${message.guild.name} (${message.guild.id}) - Shard ${db.get('shard_id')}\n${db.has('twitter_name') ? `Premium: ${db.get('premium')}\nJSON data: ${db.get('twitter_name')}` : `Nothing set`}`
            fs.writeFileSync('./data/gdpr.txt', gdpr_data)
            const attachment = new Discord.Attachment('./data/gdpr.txt')
            message.channel.send(attachment)
        }
    }
}

module.exports = gdpr