const Discord = require('discord.js')

function checkUser(twitter_client, old_avatar, old_count, old_name, acc_id){
    twitter_client.get('statuses/user_timeline', { user_id: acc_id }, (err, tweets) => {
        if (err) console.log(err)
        if (old_name && old_name === tweets[0].user.name) {
            if (debug === true) console.log(`[DEBUG: ${functiondate()} - ${functiontime()}] display name not changed`)
        }
        if (old_name && old_name !== tweets[0].user.name){
            if (debug === true) console.log(`[DEBUG: ${functiondate()} - ${functiontime()}] display name changed, setting in Discord...`)
            client.user.setUsername(tweets[0].user.name).catch(err=>{
                if (debug === true) console.log(err)
                client.user.setUsername(tweets[0].user.screen_name)
            })
            old_name = tweets[0].user.name
        }
        if (!old_name){
            if (debug === true) console.log(`[DEBUG: ${functiondate()} - ${functiontime()}] old_name not defined, setting var`)
            client.user.setUsername(tweets[0].user.name).catch(err=>{
                console.log(err)
                client.user.setUsername(tweets[0].user.screen_name)
            })
            old_name = tweets[0].user.name
        }

        if (old_count && old_count === tweets[0].user.followers_count) {
            if (debug === true) console.log(`[DEBUG: ${functiondate()} - ${functiontime()}] followers counter not changed`)
        }
        if (old_count && old_count !== tweets[0].user.followers_count){
            if (debug === true) console.log(`[DEBUG: ${functiondate()} - ${functiontime()}] followers counter changed, setting in Discord...`)
            client.user.setActivity(`${tweets[0].user.followers_count} followers`, { type: 'WATCHING' })
            old_count = tweets[0].user.profile_image_url_https.replace("normal.jpg", "200x200.jpg")
        }
        if (!old_count){
            if (debug === true) console.log(`[DEBUG: ${functiondate()} - ${functiontime()}] old_counts not defined, setting var`)
            client.user.setActivity(`${tweets[0].user.followers_count} followers`, { type: 'WATCHING' })
            old_count = tweets[0].user.followers_count
        }

        if (old_avatar && old_avatar === tweets[0].user.profile_image_url_https.replace("normal.jpg", "200x200.jpg")) {
            if (debug === true) console.log(`[DEBUG: ${functiondate()} - ${functiontime()}] avatar not changed`)
        }
        if (old_avatar && old_avatar !== tweets[0].user.profile_image_url_https.replace("normal.jpg", "200x200.jpg")){
            if (debug === true) console.log(`[DEBUG: ${functiondate()} - ${functiontime()}] avatar changed, setting in Discord...`)
            client.user.setAvatar(tweets[0].user.profile_image_url_https.replace("normal.jpg", "200x200.jpg")).catch(err=>{if (debug === true) console.log(`[${functiondate()} - ${functiontime()}] ${err}`)})
            old_avatar = tweets[0].user.profile_image_url_https.replace("normal.jpg", "200x200.jpg")
        }
        if (!old_avatar){
            if (debug === true) console.log(`[DEBUG: ${functiondate()} - ${functiontime()}] old_avatar not defined, setting var`)
            client.user.setAvatar(tweets[0].user.profile_image_url_https.replace("normal.jpg", "200x200.jpg")).catch(err=>{if (debug === true) console.log(`[${functiondate()} - ${functiontime()}] ${err}`)})
            old_avatar = tweets[0].user.profile_image_url_https.replace("normal.jpg", "200x200.jpg")
        }
    })
}

function twit(twitter_client, acc_id, client, config, debug, functiondate, functiontime, old_avatar, old_count, old_name){

    setInterval(() =>
        checkUser(twitter_client, old_avatar, old_count, old_name, acc_id)
    , 5000)

    const Tstream = twitter_client.stream("statuses/filter", { follow: acc_id })

    Tstream.on('start', function(start_result) {
        if (start_result.status == 200) console.log(`🟢 Streaming API started - Watching ${config.twitter_name} (Account ID ${acc_id})`)
        else console.log(start_result.statusText)
    })
    Tstream.on("end", async response => {
        console.log(`🔴 Streaming API ended`)
        process.exit(2)
    });
    Tstream.on('data', async function(tweet) {
        try {
            var debug_header = `[${functiondate()} - ${functiontime()} - https://twitter.com/${config.twitter_name}/status/${tweet.id_str}`

            let embed = new Discord.RichEmbed

            tweet.text.replace('&amp;', '&')
            if (tweet.retweeted === true || tweet.text.startsWith('RT')) {
                if (config.retweet === true) {
                    if (debug === true) console.log(debug_header + `Retweet from @${tweet.retweeted_status.user.screen_name}`)
                    embed.setColor(config.embed_color ? config.embed_color : 'RANDOM')
                        .setAuthor(`Retweet\n${tweet.retweeted_status.user.name} (@${tweet.retweeted_status.user.screen_name})`, tweet.retweeted_status.user.profile_image_url_https.replace("normal.jpg", "200x200.jpg"), `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`)
                        .setDescription(tweet.retweeted_status.text)
                        .setTimestamp(tweet.retweeted_status.created_at)
                        .setThumbnail('https://img.icons8.com/color/96/000000/retweet.png')
                    if (tweet.retweeted_status.entities.media) embed.setImage(tweet.retweeted_status.entities.media[0].media_url_https)
                    if (client.channels.some(c => c.id == config.channel_id)) {
                        var webhooks = await client.channels.find(c => c.id == config.channel_id).fetchWebhooks()
                            .catch(client.channels.find(c => c.id == config.channel_id).createWebhook(client.user.username)
                                .then(async wh => {
                                    console.log(`Created webhook ${wh.name} for account @${tweet.user.screen_name} on channel ${wh.channelID}`)
                                    webhook.send('', {
                                        username: tweet.user.name,
                                        avatarURL: tweet.user.profile_image_url_https.replace("normal.jpg", "200x200.jpg"),
                                        embeds: [embed]
                                    })
                                })
                            )
                        webhooks = await client.channels.find(c => c.id == config.channel_id).fetchWebhooks()
                        var webhook = webhooks.first()
                        webhook.send('', {
                            username: tweet.user.name,
                            avatarURL: tweet.user.profile_image_url_https.replace("normal.jpg", "200x200.jpg"),
                            embeds: [embed]
                        })
                    } else return
                } else {
                    if (debug === true) console.log(debug_header + `Retweet from @${tweet.retweeted_status.user.screen_name}, but retweet config is disabled`)
                }
            } else if (tweet.retweeted === false || !tweet.text.startsWith('RT')) {
                if (tweet.in_reply_to_status_id == null || tweet.in_reply_to_user_id == null) {
                    if (debug === true) console.log(debug_header + `Simple tweet, id ${tweet.id_str}`)
                    embed.setColor(config.embed_color ? config.embed_color : 'RANDOM')
                        .setAuthor(`${tweet.user.name} (@${tweet.user.screen_name})`, tweet.user.profile_image_url_https.replace("normal.jpg", "200x200.jpg"), `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`)
                        .setDescription(tweet.text)
                        .setTimestamp(tweet.created_at)
                    if (tweet.entities.media) embed.setImage(tweet.entities.media[0].media_url_https)
                    if (client.channels.some(c => c.id == config.channel_id)) {
                        var webhooks = await client.channels.find(c => c.id == config.channel_id).fetchWebhooks()
                            .catch(client.channels.find(c => c.id == config.channel_id).createWebhook(client.user.username)
                                .then(async wh => {
                                    console.log(`Created webhook ${wh.name} for account @${tweet.user.screen_name} on channel ${wh.channelID}`)
                                    webhook.send('', {
                                        username: tweet.user.name,
                                        avatarURL: tweet.user.profile_image_url_https.replace("normal.jpg", "200x200.jpg"),
                                        embeds: [embed]
                                    })
                                })
                            )
                        webhooks = await client.channels.find(c => c.id == config.channel_id).fetchWebhooks()
                        var webhook = webhooks.first()
                        webhook.send('', {
                            username: tweet.user.name,
                            avatarURL: tweet.user.profile_image_url_https.replace("normal.jpg", "200x200.jpg"),
                            embeds: [embed]
                        })
                    } else return
                } else if (tweet.in_reply_to_status_id != null || tweet.in_reply_to_user_id != null) {
                    if (config.reply === false) {
                        if (debug === true) console.log(debug_header + `Reply to a tweet, but reply option is off`)
                    } else {
                        if (debug === true) console.log(debug_header + `Reply to a tweet, id ${tweet.in_reply_to_status_id}`)
                        embed.setColor(config.embed_color ? config.embed_color : 'RANDOM')
                            .setAuthor(`${tweet.user.name} (@${tweet.user.screen_name})\nReply to @${tweet.in_reply_to_screen_name}`, tweet.user.profile_image_url_https.replace("normal.jpg", "200x200.jpg"), `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`)
                            .setDescription(tweet.text.replace(`@${tweet.in_reply_to_screen_name}`, ""))
                            .setTimestamp(tweet.created_at)
                            .setThumbnail('https://cdn1.iconfinder.com/data/icons/messaging-3/48/Reply-512.png')
                        if (tweet.entities.media) embed.setImage(tweet.entities.media[0].media_url_https)
                        if (client.channels.some(c => c.id == config.channel_id)) {
                            var webhooks = await client.channels.find(c => c.id == config.channel_id).fetchWebhooks()
                                .catch(client.channels.find(c => c.id == config.channel_id).createWebhook(client.user.username)
                                    .then(async wh => {
                                        console.log(`Created webhook ${wh.name} for account @${tweet.user.screen_name} on channel ${wh.channelID}`)
                                        webhook.send('', {
                                            username: tweet.user.name,
                                            avatarURL: tweet.user.profile_image_url_https.replace("normal.jpg", "200x200.jpg"),
                                            embeds: [embed]
                                        })
                                    })
                                )
                            webhooks = await client.channels.find(c => c.id == config.channel_id).fetchWebhooks()
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
        } catch (e) {
            if (debug === true) console.log(`ERROR: ` + e)
            if (debug === true) console.log(tweet)
            if (client.channels.some(c => c.id == config.channel_id)) client.channels.find(c => c.id == config.channel_id).send(`https://twitter.com/${config.twitter_name}/status/${tweet.id_str}`)
                .catch(err => console.log(`Error sending on guild ${g.id} - ${g.name}\n${err}`))
        }
    })
    Tstream.on('error', function(err) {
        console.log(`[${functiondate()} - ${functiontime()} ] globaltwit stream error:`)
        console.log(err)
    })
    Tstream.on('stall_warnings', function(stall) {
        client.users.find(u => u.id == config.owner_id).send(`:warning: ${stall.warning.message}`)
        console.log(`[${functiondate()} - ${functiontime()} ] ${stall.warning.message} - ` + stall.warning.code)
    })
}
module.exports = twit
