const Discord = require('discord.js')
const Enmap = require('enmap')
const wait = require('util').promisify(setTimeout);

function globaltwit(twitter_client, client, config, debug, functiondate, functiontime){
    try{
    var g_acc = 0
    var g_acc_in_twitter = 0
    var old_twt = {}
    setInterval(async function(){
        try{
        client.guilds.forEach(async g=>{
            var db = new Enmap({name:'db_'+g.id})
            if (db.get('shard_id') != client.shard.id + 1 || !db.has('shard_id')) db.set('shard_id', client.shard.id + 1)
            if (!db.has('guild_name') || db.get('guild_name') != g.name) db.set('guild_name', g.name)
            var twitter_accounts = db.has('twitter_name') ? db.get('twitter_name') : undefined
            if (twitter_accounts === undefined) return
            g_acc = 0
            g_acc_in_twitter = 0
            twitter_accounts.forEach(async account=>{
                if (!account.name) return
                var twitter_params = { screen_name: account.name}

                await twitter_client.get('statuses/user_timeline', twitter_params, async (err, tweets) => {
                    var debug_header = `[${functiondate()} - ${functiontime()} - Shard ${client.shard.id + 1} - Guild ${g.id} (${g.name}) - ${g_acc_in_twitter} : ${account.name} - Channel ${account.channel} ] `
                    if (err) {
                        client.shard.send(debug_header + `Twitter GET request error:`);
                        client.shard.send(err);
                        await wait(1000)
                        return
                    }
                    
                    if (old_twt[tweets[0].user.screen_name] && old_twt[tweets[0].user.screen_name].id == tweets[0].id) {
                        if (debug === true) client.shard.send(debug_header + `no new tweets`)
                    }
                    if (old_twt[tweets[0].user.screen_name] && old_twt[tweets[0].user.screen_name].id != tweets[0].id) {
                        try{

                            let embed = new Discord.RichEmbed
    
                            tweets[0].text.replace('&amp;', '&')
    
                        if (tweets[0].retweeted === true || tweets[0].text.startsWith('RT')) {
                            if (account.retweet === true){
                                if (debug === true) client.shard.send(debug_header + `Retweet from @${tweets[0].retweeted_status.user.screen_name}`)
                                embed   .setColor(`#${tweets[0].retweeted_status.user.profile_sidebar_border_color}`)
                                        .setAuthor(`Retweet\n${tweets[0].retweeted_status.user.name} (@${tweets[0].retweeted_status.user.screen_name})`, tweets[0].retweeted_status.user.profile_image_url_https.replace("normal.jpg", "200x200.jpg"), `https://twitter.com/${tweets[0].user.screen_name}/status/${tweets[0].id_str}`)
                                        .setDescription(tweets[0].retweeted_status.text)
                                        .setTimestamp(tweets[0].retweeted_status.created_at)
                                        .setThumbnail('https://img.icons8.com/color/96/000000/retweet.png')
                                if (tweets[0].retweeted_status.entities.media) embed.setImage(tweets[0].retweeted_status.entities.media[0].media_url_https)
                                if (g.channels.some(c=>c.id == account.channel)) {
                                    var webhooks = await g.channels.find(c=>c.id == account.channel).fetchWebhooks()
                                    if (!webhooks) g.channels.find(c=>c.id == account.channel).createWebhook(client.user.username)
                                    .then(async wh=>{
                                        client.shard.send(`Created webhook ${wh.name} for account @${tweets[0].user.screen_name} on channel ${wh.channelID}`)
                                        webhooks = await g.channels.find(c=>c.id == account.channel).fetchWebhooks()
                                    })
                                    var webhook = webhooks.first()
                                    webhook.send('', {
                                        username: tweets[0].user.name,
                                        avatarURL: tweets[0].user.profile_image_url_https.replace("normal.jpg", "200x200.jpg"),
                                        embeds: [embed]
                                    })
                                } else return
                            } else {
                                if (debug === true) client.shard.send(debug_header + `Retweet from @${tweets[0].retweeted_status.user.screen_name}, but retweet config is disabled`)
                            }
                        } else if (tweets[0].retweeted === false || !tweets[0].text.startsWith('RT')) {
                            if (tweets[0].in_reply_to_status_id == null || tweets[0].in_reply_to_user_id == null) {
                                if (debug === true) client.shard.send(debug_header + `Simple tweet, id ${tweets[0].id_str}`)
                                embed   .setColor(`#${tweets[0].user.profile_sidebar_border_color}`)
                                        .setAuthor(`${tweets[0].user.name} (@${tweets[0].user.screen_name})`, tweets[0].user.profile_image_url_https.replace("normal.jpg", "200x200.jpg"), `https://twitter.com/${tweets[0].user.screen_name}/status/${tweets[0].id_str}`)
                                        .setDescription(tweets[0].text)
                                        .setTimestamp(tweets[0].created_at)
                                if (tweets[0].entities.media) embed.setImage(tweets[0].entities.media[0].media_url_https)
                                if (g.channels.some(c=>c.id == account.channel)) {
                                    var webhooks = await g.channels.find(c=>c.id == account.channel).fetchWebhooks()
                                    if (!webhooks) g.channels.find(c=>c.id == account.channel).createWebhook(client.user.username)
                                    .then(async wh=>{
                                        client.shard.send(`Created webhook ${wh.name} for account @${tweets[0].user.screen_name} on channel ${wh.channelID}`)
                                        webhooks = await g.channels.find(c=>c.id == account.channel).fetchWebhooks()
                                    })
                                    var webhook = webhooks.first()
                                    webhook.send('', {
                                        username: tweets[0].user.name,
                                        avatarURL: tweets[0].user.profile_image_url_https.replace("normal.jpg", "200x200.jpg"),
                                        embeds: [embed]
                                    })
                                } else return
                            } else if (tweets[0].in_reply_to_status_id != null || tweets[0].in_reply_to_user_id != null){
                                if (account.reply === false){
                                    if (debug === true) client.shard.send(debug_header + `Reply to a tweet, but reply option is off`)
                                } else {
                                    if (debug === true) client.shard.send(debug_header + `Reply to a tweet, id ${tweets[0].in_reply_to_status_id}`)
                                    embed   .setColor(`#${tweets[0].user.profile_sidebar_border_color}`)
                                            .setAuthor(`${tweets[0].user.name} (@${tweets[0].user.screen_name})\nReply to @${tweets[0].in_reply_to_screen_name}`, tweets[0].user.profile_image_url_https.replace("normal.jpg", "200x200.jpg"), `https://twitter.com/${tweets[0].user.screen_name}/status/${tweets[0].id_str}`)
                                            .setDescription(tweets[0].text.replace(`@${tweets[0].in_reply_to_screen_name}`, ""))
                                            .setTimestamp(tweets[0].created_at)
                                            .setThumbnail('https://cdn1.iconfinder.com/data/icons/messaging-3/48/Reply-512.png')
                                    if (tweets[0].entities.media) embed.setImage(tweets[0].entities.media[0].media_url_https)
                                    if (g.channels.some(c=>c.id == account.channel)) {
                                        var webhooks = await g.channels.find(c=>c.id == account.channel).fetchWebhooks()
                                        if (!webhooks) g.channels.find(c=>c.id == account.channel).createWebhook(client.user.username)
                                        .then(async wh=>{
                                            client.shard.send(`Created webhook ${wh.name} for account @${tweets[0].user.screen_name} on channel ${wh.channelID}`)
                                            webhooks = await g.channels.find(c=>c.id == account.channel).fetchWebhooks()
                                        })
                                        var webhook = webhooks.first()
                                        webhook.send('', {
                                            username: tweets[0].user.name,
                                            avatarURL: tweets[0].user.profile_image_url_https.replace("normal.jpg", "200x200.jpg"),
                                            embeds: [embed]
                                        })
                                    } else return
                                }
                            }
                        }
                        old_twt[tweets[0].user.screen_name] = {
                            id: tweets[0].id
                        }
                        }catch(e){
                            if (debug === true) client.shard.send(`ERROR: ${debug_header}` + e)
                            if (debug === true) client.shard.send(tweets[0])
                            if (g.channels.some(c=>c.id == account.channel)) g.channels.find(c=>c.id == account.channel).send(`https://twitter.com/${tweets[0].user.screen_name}/status/${tweets[0].id_str}`)
                            .catch(err=>client.shard.send(`Error sending on guild ${g.id} - ${g.name}\n${err}`))
                            old_twt[tweets[0].user.screen_name] = {
                                id: tweets[0].id
                            }
                        }
                    }
                    if (!old_twt[tweets[0].user.screen_name]) {
                        if (debug === true) client.shard.send(debug_header + `old_tweets not defined, setting var`)
                        old_twt[tweets[0].user.screen_name] = {
                            id: tweets[0].id
                        }
                    }
                    g_acc_in_twitter++
                })
                g_acc++
            })
            client.shard.send('')
        });
    } catch (e) {
        client.shard.send(`[${functiondate()} - ${functiontime()} - Shard ${client.shard.id + 1} - Guild ${g.id} (${g.name}) ] globaltwit interval function error:` + e);
    }
    }, 30 * 1000) // 30 sec
    
    } catch (e) {
        client.shard.send(`[${functiondate()} - ${functiontime()} - Shard ${client.shard.id + 1} - Guild ${g.id} (${g.name}) ] globaltwit function error:` + e);
    }
}
module.exports = globaltwit
