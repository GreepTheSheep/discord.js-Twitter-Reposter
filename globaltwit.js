const Discord = require('discord.js')
const Twitter = require('twitter-lite')
const Enmap = require('enmap')
const wait = require('util').promisify(setTimeout);

function globaltwit(twitter_client, tokens, client, config, debug, functiondate, functiontime, twit_send, authorised_guilds_in_maintenance, newaccs){
    try{
        var twitter_ids = []
            var account_params = []
            client.guilds.forEach(async g=>{
                if (!twit_send) {
                    if (!authorised_guilds_in_maintenance.includes(g.id)) return
                }
                client.shard.send('Checking guild ' + g.id)
                var db = new Enmap({name:'db_'+g.id})
                if (db.get('shard_id') != client.shard.id + 1 || !db.has('shard_id')) db.set('shard_id', client.shard.id + 1)
                if (!db.has('guild_name') || db.get('guild_name') != g.name) db.set('guild_name', g.name)
                var twitter_accounts = db.has('twitter_name') ? db.get('twitter_name') : undefined
                if (twitter_accounts === undefined) {
                    return client.shard.send('Has not a db')
                }
                twitter_accounts.forEach(async account=>{
                    client.shard.send('Checking twitter account ' + account.name)
                    if (!account.twitter_id) {
                        twitter_client.get('users/show', { screen_name: account.name}).then(result=>{
                            account.twitter_id = result.id_str
                        })
                        .catch(err=>{
                            client.shard.send(debug_header + `Twitter User GET request error: ` + err.message + ' - ' + err.code);
                            client.shard.send(err)
                            return
                        })
                    }
                    twitter_ids.push(account.twitter_id)
                    account_params[account.twitter_id].push(account)
                })
            });
    Tstream = twitter_client.stream("statuses/filter", { follow: twitter_ids });
    setInterval(async function(){
        if (newaccs){
            var twitter_ids = []
            var account_params = []
            client.guilds.forEach(async g=>{
                if (!twit_send) {
                    if (!authorised_guilds_in_maintenance.includes(g.id)) return
                }
                client.shard.send('Checking guild ' + g.id)
                var db = new Enmap({name:'db_'+g.id})
                if (db.get('shard_id') != client.shard.id + 1 || !db.has('shard_id')) db.set('shard_id', client.shard.id + 1)
                if (!db.has('guild_name') || db.get('guild_name') != g.name) db.set('guild_name', g.name)
                var twitter_accounts = db.has('twitter_name') ? db.get('twitter_name') : undefined
                if (twitter_accounts === undefined) {
                    return client.shard.send('Has not a db')
                }
                twitter_accounts.forEach(async account=>{
                    client.shard.send('Checking twitter account ' + account.name)
                    if (!account.twitter_id) {
                        twitter_client.get('users/show', { screen_name: account.name}).then(result=>{
                            account.twitter_id = result.id_str
                        })
                        .catch(err=>{
                            client.shard.send(debug_header + `Twitter User GET request error: ` + err.message + ' - ' + err.code);
                            client.shard.send(err)
                            return
                        })
                    }
                    twitter_ids.push(account.twitter_id)
                    account_params[account.twitter_id].push(account)
                })
            });
            // recreate new stream
            delete Tstream
            await wait(45*1000)
            Tstream = twitter_client.stream("statuses/filter", { follow: twitter_ids })
            newaccs = false
        } else client.shard.send('No new accs')
    }, 60*1000)

    var debug_header = `[${functiondate()} - ${functiontime()} - Shard ${client.shard.id + 1}] `

    Tstream.on('start', function (start_result) {
        if (start_result.status == 200) client.shard.send(`🟢 Streaming API started`)
        else client.shard.send(start_result.statusText)
    })
    Tstream.on('data', async function (tweet) {
        try{

            client.guilds.forEach(g=>{
                var db = new Enmap({name:'db_'+g.id})
                var twitter_accounts = db.has('twitter_name') ? db.get('twitter_name') : undefined
                if (twitter_accounts === undefined) return
                twitter_accounts.forEach(async account=>{
                    if (account.twitter_id == tweet.user.id_str) {
                        
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
                                if (client.channels.some(c=>c.id == account.channel)) {
                                    var webhooks = await client.channels.find(c=>c.id == account.channel).fetchWebhooks()
                                    .catch(client.channels.find(c=>c.id == account.channel).createWebhook(client.user.username)
                                    .then(async wh=>{
                                            client.shard.send(`Created webhook ${wh.name} for account @${tweet.user.screen_name} on channel ${wh.channelID}`)
                                            webhook.send('', {
                                                username: tweet.user.name,
                                                avatarURL: tweet.user.profile_image_url_https.replace("normal.jpg", "200x200.jpg"),
                                                embeds: [embed]
                                            })
                                        })
                                    )
                                    webhooks = await client.channels.find(c=>c.id == account.channel).fetchWebhooks()
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
                                if (client.channels.some(c=>c.id == account.channel)) {
                                    var webhooks = await client.channels.find(c=>c.id == account.channel).fetchWebhooks()
                                    .catch(client.channels.find(c=>c.id == account.channel).createWebhook(client.user.username)
                                        .then(async wh=>{
                                            client.shard.send(`Created webhook ${wh.name} for account @${tweet.user.screen_name} on channel ${wh.channelID}`)
                                            webhook.send('', {
                                                username: tweet.user.name,
                                                avatarURL: tweet.user.profile_image_url_https.replace("normal.jpg", "200x200.jpg"),
                                                embeds: [embed]
                                            })
                                        })
                                    )
                                    webhooks = await client.channels.find(c=>c.id == account.channel).fetchWebhooks()
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
                                    if (client.channels.some(c=>c.id == account.channel)) {
                                        var webhooks = await client.channels.find(c=>c.id == account.channel).fetchWebhooks()
                                        .catch(client.channels.find(c=>c.id == account.channel).createWebhook(client.user.username)
                                            .then(async wh=>{
                                                client.shard.send(`Created webhook ${wh.name} for account @${tweet.user.screen_name} on channel ${wh.channelID}`)
                                                webhook.send('', {
                                                    username: tweet.user.name,
                                                    avatarURL: tweet.user.profile_image_url_https.replace("normal.jpg", "200x200.jpg"),
                                                    embeds: [embed]
                                                })
                                            })
                                        )
                                        webhooks = await client.channels.find(c=>c.id == account.channel).fetchWebhooks()
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
                    }
                })
            })
        }catch(e){
            if (debug === true) client.shard.send(`ERROR: ${debug_header}` + e)
            if (debug === true) client.shard.send(tweet)
            if (client.channels.some(c=>c.id == account.channel)) client.channels.find(c=>c.id == account.channel).send(`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`)
            .catch(err=>client.shard.send(`Error sending on guild ${g.id} - ${g.name}\n${err}`))               
        }
    })
    Tstream.on('error', function (err) {
        client.shard.send(`[${functiondate()} - ${functiontime()} - Shard ${client.shard.id + 1} - Guild ${g.id} (${g.name}) ] globaltwit stream error:`)
        client.shard.send(err)
    })
    Tstream.on('stall_warnings', function (stall) {
        client.users.find(u=> u.id == config.owner_id).send(`:warning: ${stall.warning.message}`)
        client.shard.send(`[${functiondate()} - ${functiontime()} - Shard ${client.shard.id + 1} - Guild ${g.id} (${g.name}) ] ${stall.warning.message} - ` + stall.warning.code)
    })
}catch(e){
    client.shard.send('globaltwit error: ' + e)
}
}

module.exports = globaltwit