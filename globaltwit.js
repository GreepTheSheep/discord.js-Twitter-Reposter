const Discord = require('discord.js')
const Twitter = require('twit')
const Enmap = require('enmap')

function globaltwit(twitter_client, tokens, client, config, debug, functiondate, functiontime, twit_send, authorised_guilds_in_maintenance){
    try{
    var g_acc_in_twitter = 0
        client.guilds.forEach(async g=>{
            var db = new Enmap({name:'db_'+g.id})
            if (db.get('shard_id') != client.shard.id + 1 || !db.has('shard_id')) db.set('shard_id', client.shard.id + 1)
            if (!db.has('guild_name') || db.get('guild_name') != g.name) db.set('guild_name', g.name)
            if (!twit_send && !authorised_guilds_in_maintenance.includes(g.id)) return
            var twitter_accounts = db.has('twitter_name') ? db.get('twitter_name') : undefined
            if (twitter_accounts === undefined) return
            g_acc_in_twitter = 0
            twitter_accounts.forEach(async account=>{
                if (!account.name || !account.twitter_id) return

                await twitter_client.get('users/show', { screen_name: account.name}, async (err, result) => {
                    var debug_header = `[${functiondate()} - ${functiontime()} - Shard ${client.shard.id + 1} - Guild ${g.id} (${g.name}) - ${g_acc_in_twitter} : ${account.name} - Channel ${account.channel} ] `
                    if (err) {
                        client.shard.send(debug_header + `Twitter User GET request error: ` + err.message + ' - ' + err.code);
                        client.shard.send(err)
                        return
                    }

                    if (!account.twitter_id) {
                        account.twitter_id = result.id_str
                        db.set('twitter_name', account)
                    }
                    var Tstream = T.stream('statuses/filter', { follow: result.id_str })

                    Tstream.on('start', function (result) {
                        client.shard.send(`🟢 Streaming API started for ${result.screen_name} (${result.id_str})`)
                    })
                    Tstream.on('tweet', async function (tweet) {
                        try{

                            let embed = new Discord.RichEmbed
    
                            tweet.text.replace('&amp;', '&')
    
                        if (tweet.retweeted === true || tweet.text.startsWith('RT')) {
                            if (account.retweet === true){
                                if (debug === true) client.shard.send(debug_header + `Retweet from @${tweet.retweeted_status.user.screen_name}`)
                                embed   .setColor(account.embed_color ? account.embed_color : 'RANDOM')
                                        .setAuthor(`Retweet\n${tweet.retweeted_status.user.name} (@${tweet.retweeted_status.user.screen_name})`, tweet.retweeted_status.user.profile_image_url_https.replace("normal.jpg", "200x200.jpg"), `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`)
                                        .setDescription(tweet.retweeted_status.text)
                                        .setTimestamp(tweet.retweeted_status.created_at)
                                        .setThumbnail('https://img.icons8.com/color/96/000000/retweet.png')
                                if (tweet.retweeted_status.entities.media) embed.setImage(tweet.retweeted_status.entities.media[0].media_url_https)
                                if (g.channels.some(c=>c.id == account.channel)) {
                                    var webhooks = await g.channels.find(c=>c.id == account.channel).fetchWebhooks()
                                    .catch(g.channels.find(c=>c.id == account.channel).createWebhook(client.user.username)
                                        .then(async wh=>{
                                            client.shard.send(`Created webhook ${wh.name} for account @${tweet.user.screen_name} on channel ${wh.channelID}`)
                                            webhook.send('', {
                                                username: tweet.user.name,
                                                avatarURL: tweet.user.profile_image_url_https.replace("normal.jpg", "200x200.jpg"),
                                                embeds: [embed]
                                            })
                                        })
                                    )
                                    webhooks = await g.channels.find(c=>c.id == account.channel).fetchWebhooks()
                                    var webhook = webhooks.first()
                                    webhook.send('', {
                                        username: tweet.user.name,
                                        avatarURL: tweet.user.profile_image_url_https.replace("normal.jpg", "200x200.jpg"),
                                        embeds: [embed]
                                    })
                                } else return
                            } else {
                                if (debug === true) client.shard.send(debug_header + `Retweet from @${tweet.retweeted_status.user.screen_name}, but retweet config is disabled`)
                            }
                        } else if (tweet.retweeted === false || !tweet.text.startsWith('RT')) {
                            if (tweet.in_reply_to_status_id == null || tweet.in_reply_to_user_id == null) {
                                if (debug === true) client.shard.send(debug_header + `Simple tweet, id ${tweet.id_str}`)
                                embed   .setColor(account.embed_color ? account.embed_color : 'RANDOM')
                                        .setAuthor(`${tweet.user.name} (@${tweet.user.screen_name})`, tweet.user.profile_image_url_https.replace("normal.jpg", "200x200.jpg"), `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`)
                                        .setDescription(tweet.text)
                                        .setTimestamp(tweet.created_at)
                                if (tweet.entities.media) embed.setImage(tweet.entities.media[0].media_url_https)
                                if (g.channels.some(c=>c.id == account.channel)) {
                                    var webhooks = await g.channels.find(c=>c.id == account.channel).fetchWebhooks()
                                    .catch(g.channels.find(c=>c.id == account.channel).createWebhook(client.user.username)
                                        .then(async wh=>{
                                            client.shard.send(`Created webhook ${wh.name} for account @${tweet.user.screen_name} on channel ${wh.channelID}`)
                                            webhook.send('', {
                                                username: tweet.user.name,
                                                avatarURL: tweet.user.profile_image_url_https.replace("normal.jpg", "200x200.jpg"),
                                                embeds: [embed]
                                            })
                                        })
                                    )
                                    webhooks = await g.channels.find(c=>c.id == account.channel).fetchWebhooks()
                                    var webhook = webhooks.first()
                                    webhook.send('', {
                                        username: tweet.user.name,
                                        avatarURL: tweet.user.profile_image_url_https.replace("normal.jpg", "200x200.jpg"),
                                        embeds: [embed]
                                    })
                                } else return
                            } else if (tweet.in_reply_to_status_id != null || tweet.in_reply_to_user_id != null){
                                if (account.reply === false){
                                    if (debug === true) client.shard.send(debug_header + `Reply to a tweet, but reply option is off`)
                                } else {
                                    if (debug === true) client.shard.send(debug_header + `Reply to a tweet, id ${tweet.in_reply_to_status_id}`)
                                    embed   .setColor(account.embed_color ? account.embed_color : 'RANDOM')
                                            .setAuthor(`${tweet.user.name} (@${tweet.user.screen_name})\nReply to @${tweet.in_reply_to_screen_name}`, tweet.user.profile_image_url_https.replace("normal.jpg", "200x200.jpg"), `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`)
                                            .setDescription(tweet.text.replace(`@${tweet.in_reply_to_screen_name}`, ""))
                                            .setTimestamp(tweet.created_at)
                                            .setThumbnail('https://cdn1.iconfinder.com/data/icons/messaging-3/48/Reply-512.png')
                                    if (tweet.entities.media) embed.setImage(tweet.entities.media[0].media_url_https)
                                    if (g.channels.some(c=>c.id == account.channel)) {
                                    var webhooks = await g.channels.find(c=>c.id == account.channel).fetchWebhooks()
                                    .catch(g.channels.find(c=>c.id == account.channel).createWebhook(client.user.username)
                                        .then(async wh=>{
                                            client.shard.send(`Created webhook ${wh.name} for account @${tweet.user.screen_name} on channel ${wh.channelID}`)
                                            webhook.send('', {
                                                username: tweet.user.name,
                                                avatarURL: tweet.user.profile_image_url_https.replace("normal.jpg", "200x200.jpg"),
                                                embeds: [embed]
                                            })
                                        })
                                    )
                                    webhooks = await g.channels.find(c=>c.id == account.channel).fetchWebhooks()
                                    var webhook = webhooks.first()
                                    webhook.send('', {
                                        username: tweet.user.name,
                                        avatarURL: tweet.user.profile_image_url_https.replace("normal.jpg", "200x200.jpg"),
                                        embeds: [embed]
                                    })
                                    } else return
                                }
                            }
                        }
                        }catch(e){
                            if (debug === true) client.shard.send(`ERROR: ${debug_header}` + e)
                            if (debug === true) client.shard.send(tweet)
                            if (g.channels.some(c=>c.id == account.channel)) g.channels.find(c=>c.id == account.channel).send(`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`)
                            .catch(err=>client.shard.send(`Error sending on guild ${g.id} - ${g.name}\n${err}`))
                            
                        }
                    })
                    Tstream.on('error', function (err) {
                        client.shard.send(`[${functiondate()} - ${functiontime()} - Shard ${client.shard.id + 1} - Guild ${g.id} (${g.name}) ] globaltwit stream error:` + err)
                    })
                    Tstream.on('stall_warnings', function (stall) {
                        client.users.find(u=> u.id == config.owner_id).send(`:warning: ${stall.warning.message}`)
                        client.shard.send(`[${functiondate()} - ${functiontime()} - Shard ${client.shard.id + 1} - Guild ${g.id} (${g.name}) ] ${stall.warning.message} - ` + stall.warning.code)
                    })
                    g_acc_in_twitter++
                })
            })
        });
    } catch (e) {
        client.shard.send(`[${functiondate()} - ${functiontime()} - Shard ${client.shard.id + 1} - Guild ${g.id} (${g.name}) ] globaltwit function error:` + e);
    }
}
module.exports = globaltwit
