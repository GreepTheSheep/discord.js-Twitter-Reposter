/*
    Out Of Box Experience (OOBE)
        (First-time setup)
    Version 3 of MyTweets (Greep)
*/

const Discord = require('discord.js')

async function oobe(message, client, config, functiondate, functiontime, publics, db, prefix, embed){
    if (message.content == prefix){
        if(message.member.hasPermission("ADMINISTRATOR") || message.member.id == config.owner_id){
            message.channel.send('Do you want to setup me? (send `yes` or `no`)')
            const filter = m => message.author == m.author;
            const collector = message.channel.createMessageCollector(filter, {time: 30000, max: 1});
            collector.on('collect', m => {
                if (m.content.toLowerCase() == 'yes'){
                    db.deleteAll()
                    db.set('retweet', true)
                    db.set('reply', false)
                    message.channel.send('Here we go! First, send me your Twitter account name *(it will be something like @GreepTheSheep)* **[Please respect the cases]**')
                    const collector2 = message.channel.createMessageCollector(filter, {time: 60000, max: 1});
                    collector2.on('collect', m => {
                        message.channel.send(`Ok, so your Twitter account URL will be https://twitter.com/${m.content.replace('@','')} ? (\`yes\` or \`no\`)`)
                        var acc = m.content;
                        const collector3 = message.channel.createMessageCollector(filter, {time: 30000, max: 1});
                        collector3.on('collect', m => {
                            if (m.content.toLowerCase() == 'yes'){
                                message.channel.send(`Ok ${acc.replace('@','')}, now mention the channel where I'll send your tweets`)
                                const collector4 = message.channel.createMessageCollector(filter, {time: 30000, max: 1});
                                collector4.on('collect', m => {
                                    var ch = m.mentions.channels.first()
                                    if (!ch) return message.reply('That\'s not a channel, canceling setup *(please re-mention me to restart the setup)*')
                                    db.set('twitter_name', acc.replace('@',''))
                                    db.set('channel_id', ch.id)
                                    db.set('shard_id', client.shard.id + 1)
                                    message.channel.send(`Ok, now all new tweets by @${acc.replace('@','')} will be sent in <#${ch.id}>. Thanks for setting me!\n\`Tip: type "@MyTweets help" to see more configs like retweets!\``)
                                });
                                collector4.on('end', (collected, reason) => {
                                    if (reason == 'time'){
                                        message.channel.send(`I have nothing, canceling setup`)
                                    }
                                });
                            } else if (m.content.toLowerCase() == 'no') return message.channel.send('okay, canceling setup')
                            else return message.channel.send('That\'s not a good answer, canceling setup')
                        });
                        collector3.on('end', (collected, reason) => {
                            if (reason == 'time'){
                                message.channel.send(`I have nothing, canceling setup`)
                            }
                        });
                    });
                    collector2.on('end', (collected, reason) => {
                        if (reason == 'time'){
                            message.channel.send(`I have nothing, canceling setup`)
                        }
                    });
                } else if (m.content.toLowerCase() == 'no') return message.channel.send('okay, canceling setup')
                else return message.channel.send('That\'s not a good answer, canceling setup')
            });
            collector.on('end', (collected, reason) => {
                if (reason == 'time'){
                    message.channel.send(`I have nothing, canceling setup`)
                }
            });
        } else return message.reply('You\'re not administrator of this server. Sorry!')
    }
}

module.exports = oobe