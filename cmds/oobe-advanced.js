const Discord = require('discord.js')
const Twitter = require('twitter-lite')

async function oobe_advanced(message, client, config, functiondate, functiontime, publicBot, db, prefix, prefix2, embed, args, dbl, twitter_client, twit_send, newaccs){
    if (!db.has('twitter_name')) {
        db.set('twitter_name', [])
    }
    var cache_twitter_name = db.get('twitter_name')
    if (args[0].toLowerCase() == 'help'){
        embed.setColor('#008800')
        embed.setDescription(`${twit_send?'':`🛠 MAINTENANCE MODE IS ENABLED: ${client.user.username} will not send tweets at the moment.\n\n`}For now, there are two systems of setting up a account on this bot: Step by Step or with arguments (for advanced users)\n\nIf you use step by step: just type \`@${client.user.username} setup\` and you're invited to fill up the steps.\n\nIf you use with arguments, here's the help:\n- \`@${client.user.username} setup add [Twitter username] [Channel mention]\` to add the user to a specified channel\n- \`@${client.user.username} setup remove [Twitter username]\` to delete the linked account\n- \`@${client.user.username} setup retweets [Twitter username]\` to activate or desativate retweet posting\n- \`@${client.user.username} setup replies [Twitter username]\` to activate or desativate reply posting\n- \`@${client.user.username} setup color [Twitter username] [HTML color code or 'random']\` change the color of the slidebar`)
        message.channel.send(embed)
    }
    else if (args[0].toLowerCase() == 'new' || args[0].toLowerCase() == 'add'){
        var maxAccs;
        dbl.hasVoted(message.author.id).then(voted => {
            const total = message.guild.members.array().length;
            const bots = message.guild.members.filter(m => m.user.bot).size; 
            const members = total - bots

            if (voted) maxAccs = 5
            else if (!voted && members >= 50) maxAccs = 3
            else maxAccs = 2
        });
        if (!db.get('premium') && cache_twitter_name.length >= maxAccs) {
            embed.setDescription('I\'m sorry, but you have reached the maximun number of accounts for this server\n\n[Get premium and remove this limit](https://patreon.com/Greep)')
            embed.setColor('#ff0000')
            return message.channel.send(embed)
        }
        if (!args[1]) return message.channel.send('Twitter account username argument missing')
        var twit_user_id
        const twit_user = await twitter_client.get('users/show', {screen_name: args[1].replace('@','')})
        .catch(err=>{
            client.shard.send(err)
            return message.channel.send(`Error: ${err.message}`)
        });
        cache_twitter_name.push({
            name: args[1].replace('@',''),
            twitter_id: twit_user.id_str,
            channel: message.mentions.channels.first().id,
            reply: false,
            retweet: true,
            embed_color: 'RANDOM'
        })
        db.set('twitter_name', cache_twitter_name)
        newaccs.emit('basicEvent')
        message.channel.send(`Account @${args[1].replace('@','')} added to <#${message.mentions.channels.first().id}>!`)
        //const check_number_of_accounts = require('../events/check_number.js')
        //check_number_of_accounts(client, config, debug, functiondate, functiontime, twit_send)
    }
    else if (args[0].toLowerCase() == 'remove' || args[0].toLowerCase() == 'delete'){
        if (!args[1]) return message.channel.send('Twitter account username argument missing')
        var n = 0
        cache_twitter_name.forEach(acc=>{
            if (acc.name.toLowerCase() == args[1].replace('@','').toLowerCase()){
                cache_twitter_name.splice(n,1)
                db.set('twitter_name', cache_twitter_name)
                message.channel.send(`Account @${acc.name} for channel <#${acc.channel}> deleted.`)
                newaccs.emit('basicEvent', cache_twitter_name)
                return
            }
            n++
        })
    }    
    else if (args[0].toLowerCase().startsWith('retweet')){
        if (!args[1]) return message.channel.send('Twitter account username argument missing')
        var n = 0
        cache_twitter_name.forEach(acc=>{
            if (acc.name.toLowerCase() == args[1].replace('@','').toLowerCase()){
                if (cache_twitter_name[n].retweet == false) {
                    cache_twitter_name[n].retweet = true
                    db.set('twitter_name', cache_twitter_name)
                    message.channel.send(`Retweets from @${cache_twitter_name[n].name} in the channel ${message.guild.channels.some(c=>c.id == cache_twitter_name[n].channel) ? `<#${message.guild.channels.find(c=>c.id == cache_twitter_name[n].channel).id}>` : ''} was **enabled**`)
                } else if (cache_twitter_name[n].retweet == true) {
                    cache_twitter_name[n].retweet = false
                    db.set('twitter_name', cache_twitter_name)
                    message.channel.send(`Retweets from @${cache_twitter_name[n].name} in the channel ${message.guild.channels.some(c=>c.id == cache_twitter_name[n].channel) ? `<#${message.guild.channels.find(c=>c.id == cache_twitter_name[n].channel).id}>` : ''} was **disabled**`)
                }
                return
            }
            n++
        })
    }
    else if (args[0].toLowerCase() == 'replies' || args[0].toLowerCase() == 'reply'){
        if (!args[1]) return message.channel.send('Twitter account username argument missing')
        var n = 0
        cache_twitter_name.forEach(acc=>{
            if (acc.name.toLowerCase() == args[1].replace('@','').toLowerCase()){
                if (cache_twitter_name[n].reply == false) {
                    cache_twitter_name[n].reply = true
                    db.set('twitter_name', cache_twitter_name)
                    message.channel.send(`Replies from @${cache_twitter_name[n].name} in the channel ${message.guild.channels.some(c=>c.id == cache_twitter_name[n].channel) ? `<#${message.guild.channels.find(c=>c.id == cache_twitter_name[n].channel).id}>` : ''} was **enabled**`)
                } else if (cache_twitter_name[n].reply == true) {
                    cache_twitter_name[n].reply = false 
                    db.set('twitter_name', cache_twitter_name)
                    message.channel.send(`Replies from @${cache_twitter_name[n].name} in the channel ${message.guild.channels.some(c=>c.id == cache_twitter_name[n].channel) ? `<#${message.guild.channels.find(c=>c.id == cache_twitter_name[n].channel).id}>` : ''} was **disabled**`)
                }
                return
            }
            n++
        })
    }
    else if (args[0].toLowerCase() == 'color'){
        if (!args[1]) return message.channel.send('Twitter account username argument missing')
        var n = 0
        cache_twitter_name.forEach(acc=>{
            if (acc.name.toLowerCase() == args[1].replace('@','').toLowerCase()){
                if (!args[2] || args[2].toLowerCase() == 'random'){
                    cache_twitter_name[n].embed_color = 'RANDOM'
                    return message.channel.send(`The slide color for embeds for @${cache_twitter_name[n].name} is set to random`)
                }else if (args[2].length == 6 || args[2].startsWith('#') && args[2].length == 7){
                    if (!args[2].startsWith('#')) {
                        cache_twitter_name[n].embed_color = '#' + args[2]
                        message.channel.send(`The slide color for embeds for @${cache_twitter_name[n].name} is set to \`#` + args[2] + '\`')
                    }
                    else {
                        cache_twitter_name[n].embed_color = args[2]
                        message.channel.send(`The slide color for embeds for @${cache_twitter_name[n].name} is set to \`` + args[2] + '\`')
                    }
                    db.set('twitter_name', cache_twitter_name)
                } else return message.channel.send('That\'s not valid, please check https://html-color-codes.info/ and retry')
                return
            }
            n++
        })
    }
}
module.exports = oobe_advanced
