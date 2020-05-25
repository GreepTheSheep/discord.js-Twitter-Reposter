/*
    Out Of Box Experience (OOBE)
        (First-time setup)
    Version 3 of MyTweets (Greep)
*/

const Discord = require('discord.js')

async function oobe(message, client, config, functiondate, functiontime, publicBot, db, prefix, prefix2, embed){
    if (message.content == prefix || message.content == prefix2){
        if (!db.has('twitter_name')) {
            embed.setDescription(`**__Hello ${message.author.username}!__**\n\n__You haven't linked any Twitter accounts with this server.__\nPlease type "${prefix} setup" to start the setup`)
            embed.addField('Premium status:', `Premium status is ${db.get('premium') ? '**__enabled__** 🎉' : 'disabled.\n[Get premium here](https://patreon.com/Greep)'}`)
            embed.setColor('#BE534D')
            return message.channel.send(embed)
        }
        var user_cache = []
        var counter = 0;
        var cache_twitter_name = db.get('twitter_name')
        db.get('twitter_name').forEach(()=>{
            user_cache.push(`> ${counter+1}. **@${cache_twitter_name[counter].name}** on channel <#${cache_twitter_name[counter].channel}>`)            
            counter++
        })
        embed.setDescription(`**__Hello ${message.author.username}!__**\n\nHere's the list of Twitter accounts linked with this server:\n${user_cache.join('\n')}\n\nType "${prefix} setup" to add an another account or to modify your account`)
        embed.addField('Premium status:', `Premium status is ${db.get('premium') ? '**__enabled__** 🎉' : 'disabled.\n[Get premium here](https://patreon.com/Greep)'}`)
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
                    }
                    if (db.get('twitter_name').length >= 2 && !db.get('premium')) {
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
                                            cache_twitter_name.push({
                                                name: acc.replace('@',''),
                                                channel: ch.id,
                                                reply: rp,
                                                retweet: rt,
                                                embed_color: 'RANDOM'
                                            })
                                            //console.log(cache_twitter_name)
                                            db.set('twitter_name', cache_twitter_name)

                                            ch.createWebhook(client.user.username)
                                            .then(wh=>{
                                                client.shard.send(`Created webhook ${wh.name} for account @${acc.replace('@','')} on channel ${wh.channelID}`)
                                            })
                                            
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
                    db.get('twitter_name').forEach(()=>{
                        user_cache.push(`> ${counter+1}. **@${cache_twitter_name[counter].name}** on channel <#${cache_twitter_name[counter].channel}>`)            
                        counter++
                    })
                    const bm = await message.channel.send(`Actually, you have ${counter} linked Twitter accounts with this server:\n${user_cache.join('\n')}\n\nPlease select the account you want to edit or type \`cancel\` to cancel setup`)
                    
                    const collector = message.channel.createMessageCollector(filter, {time: 30000, max: 1});
                    collector.on('collect', m => {
                        m.delete()
                        if (m.content.toLowerCase == 'cancel') return message.channel.send('Okay, stopping setup.')
                        if (!Number(m.content) || Number(m.content) == NaN) return message.channel.send('That\'s not a valid number, canceling setup')
                        var n = Number(m.content)-1
                        bm.edit(`\`\`\`Account @${db.get('twitter_name')[n].name}\nSet up on the channel #${message.guild.channels.find(c=>c.id == db.get('twitter_name')[n].channel).name} (${db.get('twitter_name')[n].channel})\n\nPlease choose the number you want to set it up:\n1. ${db.get('twitter_name')[n].retweet ? 'Enable' : 'Disable'} retweet posting\n2. ${db.get('twitter_name')[n].reply ? 'Enable' : 'Disable'} reply posting\n3. Change channel\n4. Change Twitter account\n5. Change embed slide color\n6. Delete account\`\`\``)
                        const collector2 = message.channel.createMessageCollector(filter, {time: 30000, max: 1});
                        collector2.on('collect', m => {
                            m.delete()
                            if (!Number(m.content) || Number(m.content) == NaN) return bm.edit('That\'s not a valid number, canceling setup')
                            if (m.content == '1'){      // retweet
                                if (cache_twitter_name[n].retweet == false) {
                                    cache_twitter_name[n].retweet = true
                                    db.set('twitter_name', cache_twitter_name)
                                    bm.edit(`Retweets from @${cache_twitter_name[n].name} in the channel ${message.guild.channels.some(c=>c.id == cache_twitter_name[n].channel) ? `<#${message.guild.channels.find(c=>c.id == cache_twitter_name[n].channel).id}>` : ''} was **enabled**`)
                                } else if (cache_twitter_name[n].retweet == true) {
                                    cache_twitter_name[n].retweet = false
                                    db.set('twitter_name', cache_twitter_name)
                                    bm.edit(`Retweets from @${cache_twitter_name[n].name} in the channel ${message.guild.channels.some(c=>c.id == cache_twitter_name[n].channel) ? `<#${message.guild.channels.find(c=>c.id == cache_twitter_name[n].channel).id}>` : ''} was **disabled**`)
                                }
                            }
                            else if (m.content == '2'){ // reply
                                if (cache_twitter_name[n].reply == false) {
                                    cache_twitter_name[n].reply = true
                                    db.set('twitter_name', cache_twitter_name)
                                    bm.edit(`Replies from @${cache_twitter_name[n].name} in the channel ${message.guild.channels.some(c=>c.id == cache_twitter_name[n].channel) ? `<#${message.guild.channels.find(c=>c.id == cache_twitter_name[n].channel).id}>` : ''} was **enabled**`)
                                } else if (cache_twitter_name[n].reply == true) {
                                    cache_twitter_name[n].reply = false 
                                    db.set('twitter_name', cache_twitter_name)
                                    bm.edit(`Replies from @${cache_twitter_name[n].name} in the channel ${message.guild.channels.some(c=>c.id == cache_twitter_name[n].channel) ? `<#${message.guild.channels.find(c=>c.id == cache_twitter_name[n].channel).id}>` : ''} was **disabled**`)
                                }
                            }
                            else if (m.content == '3'){ // channel
                                bm.edit(`Please mention now the new channel`)
                                const collector3 = message.channel.createMessageCollector(filter, {time: 30000, max: 1});
                                collector3.on('collect', m => {
                                    m.delete()
                                    var ch = m.mentions.channels.first()
                                    if (!ch) return bm.edit('That\'s not really a channel, canceling setup')
                                    cache_twitter_name[n].channel = ch.id
                                    db.set('twitter_name', cache_twitter_name)
                                    ch.createWebhook(`${client.user.username}`)
                                    .then(wh=>{
                                        client.shard.send(`Created webhook ${wh.name} for account @${cache_twitter_name[n].name} on channel ${wh.channelID}`)
                                    })
                                    bm.edit(`The new channel for @${db.get('twitter_name')[n].name} is now on <#${ch.id}>`)
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
                                    cache_twitter_name[n].name = m.content.replace('@', '')
                                    db.set('twitter_name', cache_twitter_name)
                                    bm.edit(`The new username is now @${m.content.replace('@', '')}`)
                                });
                                collector3.on('end', (collected, reason) => {
                                    if (reason == 'time'){
                                        message.channel.send(`Time limit exceeded, canceling setup`)
                                    }
                                });
                            }
                            else if (m.content == '5'){ // Color
                                bm.edit(`Set a HTML color code like:\`\`\`#000000 : Black\n#FFFFFF : White\n#FF0000 : Red\n#00FF00 : Green\n#0000FF : Blue\`\`\`or you can type \`RANDOM\`. Take a look at https://html-color-codes.info/ to check your color and get the code`)
                                const collector3 = message.channel.createMessageCollector(filter, {time: 30000, max: 1});
                                collector3.on('collect', m => {
                                    m.delete()
                                    if (m.content.toLowerCase() == 'random'){
                                        cache_twitter_name[n].embed_color = 'RANDOM'
                                        db.set('twitter_name', cache_twitter_name)
                                        bm.edit('Your embed slide color is now randomized')
                                    } else if (m.content.length == 6 || m.content.startsWith('#') && m.content.length == 7){
                                        if (m.content.startsWith('#')) m.content.replace('#','')
                                        
                                        cache_twitter_name[n].embed_color = '#' + m.content
                                        db.set('twitter_name', cache_twitter_name)
                                        bm.edit('Your embed slide color is now set to \`#' + m.content + '\`')
                                    } else return bm.edit('That\'s not valid, please retry later')
                                });
                                collector3.on('end', (collected, reason) => {
                                    if (reason == 'time'){
                                        message.channel.send(`Time limit exceeded, canceling setup`)
                                    }
                                });                                
                            }
                            else if (m.content == '6'){ // Delete
                                cache_twitter_name.splice(n,1)

                                db.set('twitter_name', cache_twitter_name)

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
