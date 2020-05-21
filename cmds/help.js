const Discord = require('discord.js')

function helpcmd(message, client, config, functiondate, functiontime, publicBot, db, prefix, prefix2, embed) {
    if (message.content.toLowerCase() == prefix + ' help' || message.content.toLowerCase() == prefix2 + ' help'){
        embed.setTitle('Configuration menu')
        .setDescription(`The prefix is mention.\n\nTo change settings, redo the config by just mentionning me : \`@${client.user.tag} setup\`\n\n\`@${client.user.tag} reset\` - Reset the database. WARNING: no confirmation\n\`@${client.user.tag} gdpr\` - Export data for your server on .txt file`)
        .addField('Any questions?', `\`@${client.user.tag} info\`: Get some informations and invite the bot to your server`)
        message.channel.send(embed)
    }
    
    if (message.content.toLowerCase() == prefix + ' info' || message.content.toLowerCase() == prefix2 + ' info'){
        embed.setTitle('Informations')
            .addField('Shard', `${client.shard.id + 1} / ${client.shard.count}`, true)
            .addField('Need help?', '[Join support server](https://discord.gg/3qzcz4e)', true)
            .addField('Problems?', '[Open an issue on GitHub](https://github.com/GreepTheSheep/discord.js-Twitter-Reposter/issues/new/choose)', true)
            .addField('Invite the bot to your server', `[Invite me!](https://discordapp.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=604826688&scope=bot)`, true)
            .addField('Credits:', client.user.username + ' is created by Greep#3022\n[Follow me on Twitter!](https://twitter.com/GreepTheSheep)', true)
        message.channel.send(embed)
    }
}

module.exports = helpcmd
