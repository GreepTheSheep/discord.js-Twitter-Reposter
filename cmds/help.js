const Discord = require('discord.js')

async function helpcmd(message, client, config, functiondate, functiontime, publicBot, db, prefix, prefix2, embed, dbl, twit_send) {
    if (message.content.toLowerCase() == prefix + ' help' || message.content.toLowerCase() == prefix2 + ' help'){
        embed.setTitle('Configuration menu')
        .setDescription(`*The prefix is mention.*\n\n\`@${client.user.tag} setup help\` - Shows help about configuration\n\n\`@${client.user.tag} reset\` - Reset the database. WARNING: no confirmation\n\`@${client.user.tag} gdpr\` - Export data for your server on .txt file\n\`@${client.user.tag} info\` - Get some informations and invite the bot to your server`)
        message.channel.send(embed)
    }
    
    if (message.content.toLowerCase() == prefix + ' info' || message.content.toLowerCase() == prefix2 + ' info'){
        embed.setTitle('Informations')
        if (!twit_send) embed.setDescription(`MAINTENANCE MODE IS ENABLED: ${client.user.username} will not send tweets at the moment.`)
            embed.addField(`${client.user.username} is on Twitter!`, `[Follow on Twitter!](https://twitter.com/MyTweetsDiscord)`)
            .addField('Maximum accounts autorised for non-premium servers:', '- Less than 50 members: 2 accounts\n- More than 50 members: 3 accounts\n- Voted on [top.gg](https://top.gg/bot/'+client.user.id+'/vote): 5 accounts')
            .addField('Have you voted on top.gg?', await dbl.hasVoted(message.author.id) ? 'Yes! You can add 5 accounts maximum on this server!' : 'No, vote on [top.gg](https://top.gg/bot/'+client.user.id+'/vote) and increases the maximum to 5 accounts!')
            .addField('Shard', `${client.shard.id + 1} / ${client.shard.count}`, true)
            .addField('Need help?', '[Join support server](https://discord.gg/3qzcz4e)', true)
            .addField('Problems?', '[Open an issue on GitHub](https://github.com/GreepTheSheep/discord.js-Twitter-Reposter/issues/new/choose)', true)
            .addField('Invite the bot to your server', `[Invite me!](https://discordapp.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=604826688&scope=bot)`, true)
            .addField('Credits:', client.user.username + ' is created by Greep#3022', true)
        message.channel.send(embed)
    }
}

module.exports = helpcmd
