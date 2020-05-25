const Discord = require('discord.js')

async function oobe_advanced(message, client, config, functiondate, functiontime, publicBot, db, prefix, prefix2, embed, args){
    if (!db.has('twitter_name')) {
        db.set('twitter_name', [])
    }
    if (args[0].toLowerCase() == 'help'){
        embed.setColor('#008800')
        embed.setDescription(`For now, there are two systems of setting up a account on this bot: Step by Step or with arguments (for advanced users)\n\nIf you use step by step: just type \`@${client.user.username} setup\` and you're invited to fill up the steps.\n\nIf you use with arguments, here's the help:\n- \`@${client.user.username} setup add [Twitter username] [Channel mention]\` to add the user to a specified channel\n- \`@${client.user.username} setup remove [Twitter username]\` to delete the linked account\n- \`@${client.user.username} setup retweets [Twitter username]\` to activate or desativate retweet posting\n- \`@${client.user.username} setup replies [Twitter username]\` to activate or desativate reply posting\n- \`@${client.user.username} setup color [Twitter username] [HTML color code or 'random']\` change the color of the slidebar`)
        message.channel.send(embed)
    }
    else if (args[0].toLowerCase() == 'new' || args[0].toLowerCase() == 'add'){
        if (db.get('twitter_name').length >= 2 && !db.get('premium')) {
            embed.setDescription('I\'m sorry, but you have reached the maximun number of accounts for this server\n\n[Get premium and remove this limit](https://patreon.com/Greep)')
            embed.setColor('#ff0000')
            return message.channel.send(embed)
        }
        if (!args[1]) return message.channel.send('Twitter account username argument missing')
        if (!args[2] || !message.mentions.channels) return message.channel.send('Channel mention argument missing')
        var cache_twitter_name = db.get('twitter_name')
        //console.log(cache_twitter_name)
        cache_twitter_name.push({
            name: args[1].replace('@',''),
            channel: message.mentions.channels.first().id,
            reply: false,
            retweet: true,
            embed_color: 'RANDOM'
        })
        //console.log(cache_twitter_name)
        db.set('twitter_name', cache_twitter_name)
        message.channel.send(`Account @${args[1].replace('@','')} added to <#${message.mentions.channels.first().id}>!`)
    }else {
        message.channel.send('Work in progress, be patient...')
    }
    /*
    else if (args[0].toLowerCase() == 'remove' || args[0].toLowerCase() == 'delete'){
        var cache_twitter_name = db.get('twitter_name')

        cache_twitter_name.splice(n,1)
        db.set('twitter_name', cache_twitter_name)
        bm.edit('Account deleted.')
    }
    else if (args[0].toLowerCase().startsWith('retweet')){

    }
    else if (args[0].toLowerCase() == 'replies' || args[0].toLowerCase() == 'reply'){

    }
    else if (args[0].toLowerCase() == 'color'){

    }
    */
}
module.exports = oobe_advanced