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
        var user_cache = []
        var counter = 0;
        var cache_twitter_name = db.get('twitter_name')
        var cache_channel_id = db.get('channel_id')
        db.get('twitter_name').forEach(()=>{
            user_cache.push(`> ${counter+1}. **@${cache_twitter_name[counter]}** on channel <#${cache_channel_id[counter]}>`)            
            counter++
        })
        embed.setDescription(`**__Hello ${message.author.username}!__**\n\nHere's the list of Twitter accounts linked with this server:\n${user_cache.join('\n')}\n\nType "${prefix} setup" to add an another account or to modify your account`)
        embed.setColor('#068049')
        message.channel.send(embed)
    }
    else if (message.content == prefix + ' setup' || message.content == prefix2 + ' setup' || message.content == prefix + ' oobe' || message.content == prefix2 + ' oobe'){
        if(message.member.hasPermission("ADMINISTRATOR") || message.member.id == config.owner_id){
            const filter = m => message.author == m.author;
            embed.setDescription(`**__Hello ${message.author.username}!__**\n\nPlease make your choice by typing the number: \`\`\`1 - Link new account to this server\n2 - Modify an linked account\`\`\``)
            embed.setColor('RANDOM')
            const bmembed = await message.channel.send(embed)
            const collector = message.channel.createMessageCollector(filter, {time: 30000, max: 1});
            collector.on('collect', async m => {
                if (m.content == '1'){ // Create new account
                    if (!db.has('twitter_name')) {
                        db.set('twitter_name', [])
                        db.set('channel_id', [])
                        db.set('old_tweets', [])
                        db.set('reply', [])
                        db.set('retweet', [])
                    }
                    if (db.get('twitter_name').length == 2 && !db.get('premium')) {
                        embed.setDescription('I\'m sorry, but you have reached the maximun number of accounts for this server\n\n[Get premium and remove this limit](https://patreon.com/Greep)')
                        embed.setColor('#ff0000')
                        return message.channel.send(embed)
                    }
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
                                            //console.log(cache_twitter_name)
                                            cache_twitter_name.push(acc.replace('@',''))
                                            //console.log(cache_twitter_name)
                                            db.set('twitter_name', cache_twitter_name)

                                            var cache_channel_id = db.get('channel_id')
                                            //console.log(cache_channel_id)
                                            cache_channel_id.push(ch.id)
                                            //console.log(cache_channel_id)
                                            db.set('channel_id', cache_channel_id)

                                            ch.createWebhook(`${client.user.username}`)
                                            .then(wh=>{
                                                client.shard.send(`Created webhook ${wh.name} on channel ${wh.channelID}`)
                                            })

                                            var cache_old_tweets = db.get('old_tweets')
                                            cache_old_tweets.push(null)
                                            db.set('old_tweets', cache_old_tweets)

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
                    if (!db.has('twitter_name')) return message.channel.send('You haven\'t linked any Twitter accounts in this server. Please link a Twitter account before continue.');
                    var user_cache = []
                    var counter = 0;
                    var cache_twitter_name = db.get('twitter_name')
                    var cache_channel_id = db.get('channel_id')
                    db.get('twitter_name').forEach(()=>{
                        user_cache.push(`> ${counter+1}. **@${cache_twitter_name[counter]}** on channel <#${cache_channel_id[counter]}>`)            
                        counter++
                    })
                    const bm = await message.channel.send(`Actually, you have ${counter} linked Twitter accounts with this server:\n${user_cache.join('\n')}\n\nPlease select the account you want to edit or type \`cancel\` to cancel setup`)
                    
                    const collector = message.channel.createMessageCollector(filter, {time: 30000, max: 1});
                    collector.on('collect', m => {
                        m.delete()
                        if (m.content.toLowerCase == 'cancel') return message.channel.send('Okay, stopping setup.')
                        if (!Number(m.content) || Number(m.content) == NaN) return message.channel.send('That\'s not a valid number, canceling setup')
                        var n = Number(m.content)-1
                        bm.edit(`\`\`\`Account @${db.get('twitter_name')[n]}\nSet up on the channel #${message.guild.channels.find(c=>c.id == db.get('channel_id')[n]).name} (${db.get('channel_id')[n]})\n\nPlease choose the number you want to set it up:\n1. ${db.get('retweet')[n] ? 'Enable' : 'Disable'} retweet posting\n2. ${db.get('reply')[n] ? 'Enable' : 'Disable'} reply posting\n3. Change channel\n4. Change Twitter account\n5. Delete account\`\`\``)
                        const collector2 = message.channel.createMessageCollector(filter, {time: 30000, max: 1});
                        collector2.on('collect', m => {
                            m.delete()
                            if (!Number(m.content) || Number(m.content) == NaN) return bm.edit('That\'s not a valid number, canceling setup')
                            if (m.content == '1'){      // retweet
                                var cache_rt = db.get('retweet')
                                if (cache_rt == false) {
                                    cache_rt[n] == true
                                    db.set('retweet', cache_rt)
                                    bm.edit(`Retweets from @${db.get('twitter_name')[n]} in the channel ${message.guild.channels.find(c=>db.get('channel_id')[n]) ? `<#${message.guild.channels.find(c=>db.get('channel_id')[n]).id}>` : ''} was **enabled**`)
                                } else if (cache_rt == true) {
                                    cache_rt[n] == false
                                    db.set('retweet', cache_rt)
                                    bm.edit(`Retweets from @${db.get('twitter_name')[n]} in the channel ${message.guild.channels.find(c=>db.get('channel_id')[n]) ? `<#${message.guild.channels.find(c=>db.get('channel_id')[n]).id}>` : ''} was **disabled**`)
                                }
                            }
                            else if (m.content == '2'){ // reply
                                var cache_rp = db.get('reply')
                                if (cache_rp[n] == false) {
                                    cache_rp[n] = true
                                    db.set('reply', cache_rp)
                                    bm.edit(`Replies from @${db.get('twitter_name')[n]} in the channel ${message.guild.channels.find(c=>db.get('channel_id')[n]) ? `<#${message.guild.channels.find(c=>db.get('channel_id')[n]).id}>` : ''} was **enabled**`)
                                } else if (cache_rp[n] == true) {
                                    cache_rp[n] = false 
                                    db.set('reply', cache_rp)
                                    bm.edit(`Replies from @${db.get('twitter_name')[n]} in the channel ${message.guild.channels.find(c=>db.get('channel_id')[n]) ? `<#${message.guild.channels.find(c=>db.get('channel_id')[n]).id}>` : ''} was **disabled**`)
                                }
                            }
                            else if (m.content == '3'){ // channel
                                bm.edit(`Please mention now the new channel`)
                                const collector3 = message.channel.createMessageCollector(filter, {time: 30000, max: 1});
                                collector3.on('collect', m => {
                                    m.delete()
                                    var ch = m.mentions.channels.first()
                                    if (!ch) return bm.edit('That\'s not really a channel, canceling setup')
                                    cache_channel_id[n] = ch.id
                                    db.set('channel_id', cache_channel_id)
                                    ch.createWebhook(`${client.user.username}`)
                                    .then(wh=>{
                                        client.shard.send(`Created webhook ${wh.name} on channel ${wh.channelID}`)
                                    })
                                    bm.edit(`The new channel for @${db.get('twitter_name')[n]} is now on <#${ch.id}>`)
                                });
                                collector3.on('end', (collected, reason) => {
                                    if (reason == 'time'){
                                        message.channel.send(`Time limit exceeded, canceling setup`)
                                    }
                                });
                            }
                            else if (m.content == '4'){ // Twitter name
                                bm.edit(`Please set the new Twitter username (Not the URL)`)
                                const collector3 = message.channel.createMessageCollector(filter, {time: 30000, max: 1});
                                collector3.on('collect', m => {
                                    m.delete()
                                    cache_twitter_name[n] = m.content.replace('@', '')
                                    db.set('twitter_name', cache_twitter_name)
                                    bm.edit(`The new username is now @${m.content.replace('@', '')}`)
                                });
                                collector3.on('end', (collected, reason) => {
                                    if (reason == 'time'){
                                        message.channel.send(`Time limit exceeded, canceling setup`)
                                    }
                                });
                            }
                            else if (m.content == '5'){ // Delete
                                var cache_old_tweets = db.get('old_tweets')
                                var cache_reply = db.get('reply')
                                var cache_retweet = db.get('retweet')

                                cache_twitter_name.splice(n,1)
                                cache_channel_id.splice(n,1)
                                cache_old_tweets.splice(n,1)
                                cache_reply.splice(n,1)
                                cache_retweet.splice(n,1)

                                db.set('twitter_name', cache_twitter_name)
                                db.set('channel_id', cache_channel_id)
                                db.set('old_tweets', cache_old_tweets)
                                db.set('reply', cache_reply)
                                db.set('retweet', cache_retweet)

                                bm.edit('Account deleted.')
                                
                            }
                            else return bm.edit('Out of range, canceling setup.')
                        })
                        collector2.on('end', (collected, reason) => {
                            if (reason == 'time'){
                                message.channel.send(`Time limit exceeded, canceling setup`)
                            }
                        });
                    });
                    collector.on('end', (collected, reason) => {
                        if (reason == 'time'){
                            message.channel.send(`Time limit exceeded, canceling setup`)
                        }
                    });
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
    }
}

module.exports = oobe