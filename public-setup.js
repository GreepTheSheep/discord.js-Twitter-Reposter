const Discord = require('discord.js')
const Enmap = require('enmap')
const shell = require('shelljs')
const fs = require('fs')

async function setup(message, client, config, functiondate, functiontime, publics){
    const prefix = `<@!${client.user.id}>`
    const prefix2 = `<@${client.user.id}>`
    let embed = new Discord.RichEmbed
    var db = new Enmap({name:'db_'+message.guild.id})
    embed.setAuthor(client.user.username, client.user.displayAvatarURL)
    embed.setFooter(`${client.user.tag}, created by Greep#3022`)

    if (message.content == prefix || message.content == prefix2){
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
    if (message.content.toLowerCase() == prefix + ' help' || message.content.toLowerCase() == prefix2 + ' help'){
        embed.setTitle('Configuration menu')
        .setDescription(`The prefix is mention, list of configs must be:\n\n\`@${client.user.tag} retweet\`: ${db.get('retweet') ? 'Enable' : 'Disable'} retweets from @${db.get('twitter_name')} in the channel <#${message.guild.channels.find(c=>db.get('channel_id')).id}>\n\`@${client.user.tag} reply\`: ${db.get('reply') ? 'Enable' : 'Disable'} replies from @${db.get('twitter_name')} in the channel <#${message.guild.channels.find(c=>db.get('channel_id')).id}>\n\nTo change username and channel, redo the config by just mentionning me : \`@${client.user.tag}\``)
        .addField('Any questions?', `\`@${client.user.tag} info\`: Get some informations and invite the bot to your server`)
        message.channel.send(embed)
    }
    if (message.content.toLowerCase() == prefix + ' info' || message.content.toLowerCase() == prefix2 + ' info'){
	var nBot = 0
        var array = []
        publics.forEach(id=>{
            nBot++
            if (id != client.user.id) array.push(`- [${client.user.username} ${nBot}](https://discordapp.com/api/oauth2/authorize?client_id=${id}&permissions=322624&scope=bot)`)
        })

    embed.setTitle('Informations')
    .addField('Shard', `${client.shard.id + 1} / ${client.shard.count}`, true)
	.addField('Need help?', '[Join support server](https://discord.gg/3qzcz4e)', true)
        .addField('Problems?', '[Open an issue on GitHub](https://github.com/GreepTheSheep/discord.js-Twitter-Reposter/issues/new/choose)', true)
	.addField('Invite the bot to your server', '[Invite me!](https://discordapp.com/api/oauth2/authorize?client_id=661967218174853121&permissions=322624&scope=bot)', true)
    	if (publics.size > 1) embed.addField('Want multiples accounts?', array.join('\n'), true);
        embed.addField('Credits:', client.user.username + ' is created by Greep#3022\n[Follow me on Twitter!](https://twitter.com/GreepTheSheep)', true)
        message.channel.send(embed)
    }
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

    // Owner only part
    if (message.content.toLowerCase() == prefix + ' guild' || message.content.toLowerCase() == prefix2 + ' guild'){
        if(message.member.id == config.owner_id){
            const awaitmsg = await message.channel.send('awaitng guild id...')
            var db
            const filter = m => message.author == m.author;
            const collectorguild = message.channel.createMessageCollector(filter, {time: 30000, max: 1});
            collectorguild.on('collect', m => {
                awaitmsg.delete()
                m.delete()
                var gu = client.guilds.find(g=> g.id == m.content)
                if (gu) db = new Enmap({name:'db_'+m.content})
                else if (!gu) db = new Enmap({name:'db_'+message.guild.id})
                message.channel.send(`\`\`\`Guild: ${gu ? gu.id : message.guild.id} - ${gu ? gu.name :  message.guild.name}\nChannel: ${db.has('channel_id') ? db.get('channel_id') + ' - #' + client.channels.get(db.get('channel_id')).name : 'No channel set'}\nShard: ${db.has('shard_id') ? db.get('shard_id') + ` / ${client.shard.count}`: 'Shard data empty'}\nTwitter username: ${db.has('twitter_name') ? '@'+db.get('twitter_name') : 'No name set'}\nRetweet: ${db.get('retweet') ? 'Yes' : 'No'}\nReplies: ${db.get('reply') ? 'Yes' : 'No'}\`\`\``)
                });
                collector4.on('end', (collected, reason) => {
                    if (reason == 'time'){
                        awaitmsg.delete()
                        db = new Enmap({name:'db_'+message.guild.id})
                        message.channel.send(`\`\`\`Guild: ${message.guild.id} - ${message.guild.name}\nChannel: ${db.has('channel_id') ? db.get('channel_id') + ' - #' + client.channels.get(db.get('channel_id')).name : 'No channel set'}\nShard: ${db.has('shard_id') ? db.get('shard_id') + ` / ${client.shard.count}`: 'Shard data empty'}\nTwitter username: ${db.has('twitter_name') ? '@'+db.get('twitter_name') : 'No name set'}\nRetweet: ${db.get('retweet') ? 'Yes' : 'No'}\nReplies: ${db.get('reply') ? 'Yes' : 'No'}\`\`\``)
                    }
                });
        } else return
    }
    if (message.content.toLowerCase() == prefix + ' globalinfo' || message.content.toLowerCase() == prefix2 + ' globalinfo'){
        if(message.member.id == config.owner_id){
            let values = await client.shard.broadcastEval(`
                [
                    this.shard.id,
                    this.guilds.size
                ]
            `);
            var array = [];
            var totalServ = 0
            var totalShardList = 1
            values.forEach((value) => {
                totalServ = totalServ + value[1]
                totalShardList = totalShardList++
                array.push(`• SHARD #${value[0] + 1} | Guilds: ${value[1]}`)
            });
            message.channel.send(`\`\`\`css\n${array.join('\n')}\`\`\`• Total guilds: ${totalServ}. Total shards: ${client.shard.count}${totalShardList == client.shard.count ? ' (all online)' : ` (${totalShardList} online, ${client.shard.count - totalShardList} offline)`}`);
        }else return
    }
    if (message.content.toLowerCase() == prefix + ' update' || message.content.toLowerCase() == prefix2 + ' update'){
        if(message.member.id == config.owner_id){
            try {
                message.channel.startTyping()
                shell.exec('git pull && npm install && pm2 reload ecosystem.config.js', {silent:true}, function(code, stdout, stderr) {
                    message.reply(`Output:\n\`\`\`${stdout}${stderr}\`\`\``).then(m=>message.channel.stopTyping(true));
                });
            } catch (err) {
                message.reply(`EVAL **__ERROR__**\n\`\`\`xl\n'pm2 stop GL && git pull && npm install && pm2 start GL'\`\`\``);
                message.channel.stopTyping(true)
            }
        }else return
    }
}
module.exports = setup
