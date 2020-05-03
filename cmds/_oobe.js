/*
    Out Of Box Experience (OOBE)
        (First-time setup)
    Version 3 of MyTweets (Greep)
*/

const Discord = require('discord.js')

async function oobe(message, client, config, functiondate, functiontime, publicBot, db, prefix, prefix2, embed){
    if (message.content == prefix || message.content == prefix2){
        if (!db.has('twitter_name') || !db.has('channel_id')) {
            embed.setDescription(`**__Hello ${message.author.username}!__**\n\n__You haven't linked any Twitter accounts with this server.__\nPlease type "${prefix} setup" to start the setup`)
            embed.setColor('#BE534D')
            return message.channel.send(embed)
        }
        const user_cache = []
        var counter = 0;
        var cache_twitter_name = db.get('twitter_name')
        var cache_channel_id = db.get('channel_id')
        console.log(cache_twitter_name)
        console.log(cache_channel_id)
        db.get('twitter_name').forEach(()=>{
            user_cache.push(`> ${counter+1}. **@${cache_twitter_name[counter]}** on channel <#${cache_channel_id[counter]}>`)            
            counter++
        })
        embed.setDescription(`**__Hello ${message.author.username}!__**\n\nHere's the list of Twitter accounts linked with this server:\n${user_cache.join('\n')}\nType "${prefix} setup" to add an another account or to modify your account`)
        embed.setColor('#068049')
        message.channel.send(embed)
    }
    if (message.content == prefix + ' setup' || message.content == prefix2 + ' setup' || message.content == prefix + ' oobe' || message.content == prefix2 + ' oobe'){
        if(message.member.hasPermission("ADMINISTRATOR") || message.member.id == config.owner_id){
            const filter = m => message.author == m.author;
            embed.setDescription(`**__Hello ${message.author.username}!__**\n\nPlease make your choice by typing the number: \`\`\`1 - Link new account to this server\n2 - Modify an linked account\`\`\``)
            embed.setColor('RANDOM')
            const bmembed = await message.channel.send(embed)
            const collector = message.channel.createMessageCollector(filter, {time: 30000, max: 1});
            collector.on('collect', async m => {
                m.delete()
                bmembed.delete()
                if (m.content == '1'){ // Create new account
                    if (!db.has('twitter_name')) {
                        db.set('twitter_name', [])
                        db.set('channel_id', [])
                        db.set('old_tweets', [])
                        db.set('reply', [])
                        db.set('retweet', [])
                    }
                    if (db.get('twitter_name').length == 2) return bm.edit('I\'m sorry, but you have reached the maximun number of accounts for this server')
                    const bm = await message.channel.send('Here we go! First, send me your Twitter account name *(it will be something like @GreepTheSheep)* **[Please respect the cases]**')
                    const collector2 = message.channel.createMessageCollector(filter, {time: 60000, max: 1});
                    collector2.on('collect', m => {
                        m.delete()
                        bm.edit(`Ok, so your Twitter account URL will be https://twitter.com/${m.content.replace('@','')} ? (\`yes\` or \`no\`)`)
                        var acc = m.content;
                        const collector3 = message.channel.createMessageCollector(filter, {time: 30000, max: 1});
                        collector3.on('collect', m => {
                            if (m.content.toLowerCase() == 'yes'){
                                m.delete()
                                bm.edit(`Ok ${acc.replace('@','')}, now mention the channel where I'll send your tweets`)
                                const collector4 = message.channel.createMessageCollector(filter, {time: 30000, max: 1});
                                collector4.on('collect', m => {
                                    m.delete()
                                    var ch = m.mentions.channels.first()
                                    if (!ch) return message.reply('That\'s not a channel, canceling setup')

                                    bm.edit(`Ok, now all new tweets by @${acc.replace('@','')} will be sent in <#${ch.id}>.\nDo you want the account to repost their retweets to the channel? (\`yes\` or \`no\`)`)
                                    const collector5 = message.channel.createMessageCollector(filter, {time: 30000, max: 1});
                                    collector5.on('collect', m => {
                                        m.delete()
                                        var rt
                                        var rttextbm
                                        if (m.content.toLowerCase() == 'yes'){
                                            rt = true
                                            rttextbm = `if @${acc.replace('@','')} retweet something, it will be posted in <#${ch.id}>`
                                        } else {
                                            rt = false
                                            rttextbm = `if @${acc.replace('@','')} retweet something, it will NOT be posted`
                                        }

                                        bm.edit(`Ok, ${rttextbm}.\nDo you want the account to repost replies to the channel? (\`yes\` or \`no\`)`)
                                        const collector6 = message.channel.createMessageCollector(filter, {time: 30000, max: 1});
                                        collector6.on('collect', m => {
                                            m.delete()
                                            var rp
                                            var rptextbm
                                            if (m.content.toLowerCase() == 'yes'){
                                                rp = true
                                                rptextbm = `if @${acc.replace('@','')} reply something to someone, it will be posted in <#${ch.id}>`
                                            } else {
                                                rp = false
                                                rptextbm = `if @${acc.replace('@','')} reply something to someone, it will NOT be posted`
                                            }

                                            var cache_twitter_name = db.get('twitter_name')
                                            console.log(cache_twitter_name)
                                            cache_twitter_name.push(acc.replace('@',''))
                                            console.log(cache_twitter_name)
                                            db.set('twitter_name', cache_twitter_name)

                                            var cache_channel_id = db.get('channel_id')
                                            console.log(cache_channel_id)
                                            cache_channel_id.push(ch.id)
                                            console.log(cache_channel_id)
                                            db.set('channel_id', cache_channel_id)

                                            var cache_retweet = db.get('retweet')
                                            cache_retweet.push(rt)
                                            db.set('retweet', cache_retweet)

                                            var cache_reply = db.get('reply')
                                            cache_reply.push(rp)
                                            db.set('reply', cache_reply)
                                            
                                            db.set('shard_id', client.shard.id + 1)

                                            bm.edit(`Ok, ${rptextbm}.\n\nThe setting is now done. You can now enjoy the power of Twitter reposting!`)
                                        });
                                        collector6.on('end', (collected, reason) => {
                                            if (reason == 'time'){
                                                message.channel.send(`Time limit exceeded, canceling setup`)
                                            }
                                        });
                                    });
                                    collector5.on('end', (collected, reason) => {
                                        if (reason == 'time'){
                                            message.channel.send(`Time limit exceeded, canceling setup`)
                                        }
                                    });
                                });
                                collector4.on('end', (collected, reason) => {
                                    if (reason == 'time'){
                                        message.channel.send(`Time limit exceeded, canceling setup`)
                                    }
                                });
                            } else if (m.content.toLowerCase() == 'no') return message.channel.send('okay, canceling setup')
                            else return message.channel.send('That\'s not a good answer, canceling setup')
                        });
                        collector3.on('end', (collected, reason) => {
                            if (reason == 'time'){
                                message.channel.send(`Time limit exceeded, canceling setup`)
                            }
                        });
                    });
                    collector2.on('end', (collected, reason) => {
                        if (reason == 'time'){
                            message.channel.send(`Time limit exceeded, canceling setup`)
                        }
                    });
                } else if (m.content == '2'){
                    message.channel.send(`Work in progress`)
                } else {
                    return message.channel.send(`Not a good answer, canceling setup`)
                }
            })
            collector.on('end', (collected, reason) => {
                if (reason == 'time'){
                    message.channel.send(`Time limit exceeded, canceling setup`)
                }
            })
        } else {
            return message.reply('you don\'t have sufficient permissions!')
        }
        
        /*
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
                            message.channel.send(`Time limit exceeded, canceling setup`)
                        }
                    });
                } else if (m.content.toLowerCase() == 'no') return message.channel.send('okay, canceling setup')
                else return message.channel.send('That\'s not a good answer, canceling setup')
            });
            collector3.on('end', (collected, reason) => {
                if (reason == 'time'){
                    message.channel.send(`Time limit exceeded, canceling setup`)
                }
            });
        });
        collector2.on('end', (collected, reason) => {
            if (reason == 'time'){
                message.channel.send(`Time limit exceeded, canceling setup`)
            }
        });
        */
    }
}

module.exports = oobe