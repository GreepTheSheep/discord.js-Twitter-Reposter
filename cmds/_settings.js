/*
    Settings after OOBE
    Version 3 of MyTweets (Greep)
*/
const Discord = require('discord.js')

function settings(message, client, config, functiondate, functiontime, publicBot, db, prefix, prefix2, embed) {
    if (message.content.toLowerCase() == prefix + ' retweet' || message.content.toLowerCase() == prefix2 + ' retweet'){
        if(message.member.hasPermission("ADMINISTRATOR") || message.member.id == config.owner_id){
            db.delete('old_tweets')
            if (!db.has('twitter_name')) return message.reply('The setup is not done, please redo the config by mention me')
            if (db.get('retweet') == false) {
                db.set('retweet', true)
                message.channel.send(`Retweets from @${db.get('twitter_name')} in the channel ${message.guild.channels.find(c=>db.get('channel_id')) ? `<#${message.guild.channels.find(c=>db.get('channel_id')).id}>` : ''} was **enabled**`)
            } else if (db.get('retweet') == true) {
                db.set('retweet', false)
                message.channel.send(`Retweets from @${db.get('twitter_name')} in the channel ${message.guild.channels.find(c=>db.get('channel_id')) ? `<#${message.guild.channels.find(c=>db.get('channel_id')).id}>` : ''} was **disabled**`)
            }
        } else return message.react('❌')
    }
    if (message.content.toLowerCase() == prefix + ' reply' || message.content.toLowerCase() == prefix2 + ' reply'){
        if(message.member.hasPermission("ADMINISTRATOR")|| message.member.id == config.owner_id){
            db = new Enmap({name:'db_'+message.guild.id})
            db.delete('old_tweets')
            if (!db.has('twitter_name')) return message.reply('The setup is not done, please redo the config by mention me')
            if (db.get('reply') == false) {
                db.set('reply', true)
                message.channel.send(`Replies from @${db.get('twitter_name')} in the channel ${message.guild.channels.find(c=>db.get('channel_id')) ? `<#${message.guild.channels.find(c=>db.get('channel_id')).id}>` : ''} was **enabled**`)
            } else if (db.get('reply') == true) {
                db.set('reply', false)
                message.channel.send(`Replies from @${db.get('twitter_name')} in the channel ${message.guild.channels.find(c=>db.get('channel_id')) ? `<#${message.guild.channels.find(c=>db.get('channel_id')).id}>` : ''} was **disabled**`)
            }
        } else return message.react('❌')
    }
    if (message.content.toLowerCase() == prefix + ' reset' || message.content.toLowerCase() == prefix2 + ' reset'){
        if(message.member.hasPermission("ADMINISTRATOR") || message.member.id == config.owner_id){
            db.deleteAll()
            message.channel.send(`The server database has been deleted, the bot is ready for a new setup`)
        } else return
    }
}

module.exports = settings