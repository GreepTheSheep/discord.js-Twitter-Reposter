const Discord = require('discord.js')
const Enmap = require('enmap')

function setup(message, client, config, functiondate, functiontime){
    if (message.content == '<@661967218174853121>' || message.content == '<@!661967218174853121>'){
        if(message.member.hasPermission("ADMINISTRATOR")){
            message.channel.send('Do you want to setup me? (send `yes` or `no`)')
            const filter = m => message.author == m.author;
            const collector = message.channel.createMessageCollector(filter, {time: 30000, max: 1});
            collector.on('collect', m => {
                if (m.content.toLowerCase() == 'yes'){
                    db = new Enmap({name:'db_'+message.guild.id})
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
                                db.set('twitter_name', acc.replace('@',''))
                                message.channel.send(`Ok ${acc.replace('@','')}, now mention the channel where I'll send your tweets`)
                                const collector4 = message.channel.createMessageCollector(filter, {time: 30000, max: 1});
                                collector4.on('collect', m => {
                                    var ch = m.mentions.channels.first()
                                    if (!ch) return message.reply('That\'s not a channel, canceling setup *(please re-mention me to restart the setup)*')
                                    db.set('channel_id', ch.id)
                                    message.channel.send(`Ok, now all new tweets by ${acc} will be sent in <#${ch.id}>. Thanks for setting me!\n\`Tip: type "@MyTweets help" to see more configs like retweets!\``)
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
    if (message.content == '<@661967218174853121> help' || message.content == '<@!661967218174853121> help'){
        let embed = new Discord.RichEmbed
        embed.setAuthor(client.user.username, client.user.displayAvatarURL)
        .setTitle('Configuration menu')
        .setDescription('The prefix is mention, list of configs must be:\n\n\`retweet\` (de)activate retweets\n\`reply\` (de)activate replies\n\nTo change username and channel, redo the config by just mentionning me')
        .addField('Any questions?', '[Join support server](https://discord.gg/3qzcz4e)\n[Invite the bot in your server](https://discordapp.com/api/oauth2/authorize?client_id=661967218174853121&permissions=322624&scope=bot)\n[Follow the creator on Twitter](https://twitter.com/GreepTheSheep)')
        .setFooter(`${client.user.tag}, created by Greep#3022`)
        message.channel.send(embed)
    }
    if (message.content == '<@661967218174853121> retweet' || message.content == '<@!661967218174853121> retweet'){
        if(message.member.hasPermission("ADMINISTRATOR")){
            db = new Enmap({name:'db_'+message.guild.id})
            if (db.get('retweet') == false) {
                db.set('retweet', true)
                message.channel.send('Retweets was activated')
            } else if (db.get('retweet') == true) {
                db.set('retweet', false)
                message.channel.send('Retweets was deactivated')
            }
        } else return message.react('❌')
    }
    if (message.content == '<@661967218174853121> reply' || message.content == '<@!661967218174853121> reply'){
        if(message.member.hasPermission("ADMINISTRATOR")){
            db = new Enmap({name:'db_'+message.guild.id})
            if (db.get('reply') == false) {
                db.set('reply', true)
                message.channel.send('Replies was activated')
            } else if (db.get('reply') == true) {
                db.set('reply', false)
                message.channel.send('Replies was deactivated')
            }
        } else return message.react('❌')
    }

    // Owner only part
    if (message.content == '<@661967218174853121> ginfo' || message.content == '<@!661967218174853121> ginfo'){
        if(message.member.id == '330030648456642562'){
            db = new Enmap({name:'db_'+message.guild.id})
            message.channel.send(`\`\`\`Guild: ${message.guild.id} - ${message.guild.name}\nChannel: ${db.has('channel_id') ? db.get('channel_id') + ' - #' + client.channels.get(db.get('channel_id')).name : 'No channel set'}\nTwitter username: ${db.has('twitter_name') ? '@'+db.get('twitter_name') : 'No name set'}\nRetweet: ${db.has('retweet') ? 'Yes' : 'No'}\nReplies: ${db.has('reply') ? 'Yes' : 'No'}\`\`\``)
        } else return
    }
    if (message.content == '<@661967218174853121> globalinfo' || message.content == '<@!661967218174853121> globalinfo'){
        if(message.member.id == '330030648456642562'){
            var array = []
            var gcount = 0
            client.guilds.forEach(g=>{
                gcount++
                db = new Enmap({name:'db_'+g.id})
                array.push(`Guild: ${g.id} - ${g.name} -- Twitter username: ${db.has('twitter_name') ? '@'+db.get('twitter_name') : 'No name set'}`)
            })
            message.channel.send(`\`\`\`${array.join('\n')}\nTotal: ${gcount}\`\`\``)
        }else return
    }
}
module.exports = setup