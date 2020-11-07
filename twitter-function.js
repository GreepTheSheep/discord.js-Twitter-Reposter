const Discord = require('discord.js')

function twit(twitter_client, client, twtaccounts, debug, functiondate, functiontime){

    var watchingids

    if (twtaccounts.length > 1){
        watchingids = []
        twtaccounts.forEach(acc=>{
            watchingids.push(acc.id)
        })
        watchingids.join(', ')
    } else {
        watchingids = twtaccounts[0].id
    }
    

    const Tstream = twitter_client.stream("statuses/filter", { follow: watchingids })

    Tstream.on('start', function(start_result) {
        if (start_result.status == 200){
            console.log(`🟢 Streaming API started`)
            twtaccounts.forEach(acc=>{
                console.log(`Watching ${acc.twitter_name} - ID ${acc.id}`)
            })
        }
        else console.log(start_result.statusText)
    })
    Tstream.on("end", async response => {
        console.log(`🔴 Streaming API ended`)
        process.exit(2)
    });
    Tstream.on('data', async function(tweet) {
        try {
            twtaccounts.forEach(async acc=>{
                if (!tweet.text || tweet.text == '') return
                if (tweet.user.id_str == acc.id){
                    var debug_header = `[${functiondate()} - ${functiontime()} - ${acc.twitter_name} ] `

                    let embed = new Discord.MessageEmbed

                    var webhooks = await client.channels.cache.find(c => c.id == acc.channel_id).fetchWebhooks()
                    var webhook = webhooks.find(wh=>wh.name == client.user.username)
                    if (!webhook) {
                        client.channels.cache.find(c => c.id == acc.channel_id).createWebhook(client.user.username)
                        webhook = webhooks.find(wh=>wh.name == client.user.username)
                    }

                    tweet.text.replace('&amp;', '&')
                    if (tweet.retweeted === true || tweet.text.startsWith('RT')) {
                        if (acc.retweet === true) {
                            if (debug === true) console.log(debug_header + `Retweet from @${tweet.retweeted_status.user.screen_name}`)
                            embed.setColor(acc.embed_color ? acc.embed_color : 'RANDOM')
                                .setAuthor(`Retweet\n${tweet.retweeted_status.user.name} (@${tweet.retweeted_status.user.screen_name})`, tweet.retweeted_status.user.profile_image_url_https.replace("normal.jpg", "200x200.jpg"), `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`)
                                .setDescription(tweet.retweeted_status.text)
                                .setTimestamp(tweet.retweeted_status.created_at)
                                .setThumbnail('https://img.icons8.com/color/96/000000/retweet.png')
                            if (tweet.retweeted_status.entities.media) embed.setImage(tweet.retweeted_status.entities.media[0].media_url_https)
                            if (client.channels.some(c => c.id == acc.channel_id)) {
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
                            embed.setColor(acc.embed_color ? acc.embed_color : 'RANDOM')
                                .setAuthor(`${tweet.user.name} (@${tweet.user.screen_name})`, tweet.user.profile_image_url_https.replace("normal.jpg", "200x200.jpg"), `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`)
                                .setDescription(tweet.text)
                                .setTimestamp(tweet.created_at)
                            if (tweet.entities.media) embed.setImage(tweet.entities.media[0].media_url_https)
                            if (client.channels.some(c => c.id == acc.channel_id)) {
                                webhook.send('', {
                                    username: tweet.user.name,
                                    avatarURL: tweet.user.profile_image_url_https.replace("normal.jpg", "200x200.jpg"),
                                    embeds: [embed]
                                })
                            } else return
                        } else if (tweet.in_reply_to_status_id != null || tweet.in_reply_to_user_id != null) {
                            if (acc.reply === false) {
                                if (debug === true) console.log(debug_header + `Reply to a tweet, but reply option is off`)
                            } else {
                                if (debug === true) console.log(debug_header + `Reply to a tweet, id ${tweet.in_reply_to_status_id}`)
                                embed.setColor(acc.embed_color ? acc.embed_color : 'RANDOM')
                                    .setAuthor(`${tweet.user.name} (@${tweet.user.screen_name})\nReply to @${tweet.in_reply_to_screen_name}`, tweet.user.profile_image_url_https.replace("normal.jpg", "200x200.jpg"), `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`)
                                    .setDescription(tweet.text.replace(`@${tweet.in_reply_to_screen_name}`, ""))
                                    .setTimestamp(tweet.created_at)
                                    .setThumbnail('https://cdn1.iconfinder.com/data/icons/messaging-3/48/Reply-512.png')
                                if (tweet.entities.media) embed.setImage(tweet.entities.media[0].media_url_https)
                                if (client.channels.some(c => c.id == acc.channel_id)) {
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
        } catch (e) {
            if (debug === true) console.log(`ERROR: ` + e)
            if (debug === true) console.log(tweet)
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
