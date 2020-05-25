const Discord = require('discord.js')

async function oobe_advanced(message, client, config, functiondate, functiontime, publicBot, db, prefix, prefix2, embed, args){
    if (args[0].toLowerCase() == 'help'){
        embed.setColor('#008800')
        embed.setDescription(`For now, there are two systems of setting up a account on this bot: Step by Step or with arguments (for advanced users)\n\nIf you use step by step: just type \`@${client.user.username} setup\` and you're invited to fill up the steps.\n\nIf you use with arguments, here's the help:\n- \`@${client.user.username} setup add [Twitter username] [Channel mention]\` to add the user to a specified channel\n- \`@${client.user.username} setup remove [Twitter username]\` to delete the linked account\n- \`@${client.user.username} setup retweets [Twitter username]\` to activate or desativate retweet posting\n- \`@${client.user.username} setup replies [Twitter username]\` to activate or desativate reply posting\n- \`@${client.user.username} setup color [Twitter username] [HTML color code or 'random']\` change the color of the slidebar`)
        message.channel.send(embed)
    }
    else {
        message.channel.send('Work in progress, be patient...')
    }
    /*
    else if (args[0].toLowerCase() == 'new' || args[0].toLowerCase() == 'add'){

    }
    else if (args[0].toLowerCase() == 'remove' || args[0].toLowerCase() == 'delete'){

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