const Discord = require('discord.js')
const Enmap = require('enmap')
const wait = require('util').promisify(setTimeout);

function globaltwit(twitter_client, client, config, debug, functiondate, functiontime){
    try{
    setInterval(async function(){
        try{
        client.guilds.forEach(async g=>{
            var db = new Enmap({name:'db_'+g.id})
            if (db.get('shard_id') == client.shard.id + 1 || !db.has('shard_id')) db.set('shard_id', client.shard.id + 1)
            if (!db.get('channel_id')) return
            var twitter_params = { screen_name: db.has('twitter_name') ? db.get('twitter_name') : undefined}
            if (twitter_params.screen_name === undefined) return

            twitter_client.get('statuses/user_timeline', twitter_params, async (err, tweets) => {
                if (err) {
                    client.shard.send(`[${functiondate()} - ${functiontime()} - Shard ${client.shard.id + 1} - Guild ${g.id} (${g.name}) ] Twitter GET request error:`);
                    client.shard.send(err);
                    await wait(1000)
                    return
                }
                
                if (db.has('old_tweets') && db.get('old_tweets') === tweets[0].id) {
                    if (debug === true) client.shard.send(`[DEBUG: ${functiondate()} - ${functiontime()} - Shard ${client.shard.id + 1} - Guild ${g.id} (${g.name}) ] no new tweets`)
                }
                if (db.has('old_tweets') && db.get('old_tweets') !== tweets[0].id) {
                    try{
                
                        let embed = new Discord.RichEmbed

                        tweets[0].text.replace('&amp;', '&')

                    if (tweets[0].retweeted === true || tweets[0].text.startsWith('RT')) {
                        if (db.get('retweet') === true){
                            if (debug === true) client.shard.send(`[DEBUG: ${functiondate()} - ${functiontime()} - Shard ${client.shard.id + 1} - guild ${g.id} (${g.name}) ] Retweet from @${tweets[0].retweeted_status.user.screen_name}`)
                            embed   .setColor(`#${tweets[0].retweeted_status.user.profile_sidebar_border_color}`)
                                    .setAuthor(`Retweet\n${tweets[0].retweeted_status.user.name} (@${tweets[0].retweeted_status.user.screen_name})`, tweets[0].retweeted_status.user.profile_image_url_https.replace("normal.jpg", "200x200.jpg"), `https://twitter.com/${tweets[0].user.screen_name}/status/${tweets[0].id_str}`)
                                    .setDescription(tweets[0].retweeted_status.text)
                                    .setTimestamp(tweets[0].retweeted_status.created_at)
                                    .setThumbnail('https://img.icons8.com/color/96/000000/retweet.png')
                            if (tweets[0].retweeted_status.entities.media) embed.setImage(tweets[0].retweeted_status.entities.media[0].media_url_https)
                            if (g.channels.find(c=>c.id == db.get('channel_id'))) g.channels.find(c=>c.id == db.get('channel_id')).send(embed)
                        } else {
                            if (debug === true) client.shard.send(`[DEBUG: ${functiondate()} - ${functiontime()} - Shard ${client.shard.id + 1} - guild ${g.id} (${g.name}) ] Retweet from @${tweets[0].retweeted_status.user.screen_name}, but retweet config is disabled`)
                        }
                    } else if (tweets[0].retweeted === false || !tweets[0].text.startsWith('RT')) {
                        if (tweets[0].in_reply_to_status_id == null || tweets[0].in_reply_to_user_id == null) {
                            if (debug === true) client.shard.send(`[DEBUG: ${functiondate()} - ${functiontime()} - Shard ${client.shard.id + 1} - guild ${g.id} (${g.name}) ] Simple tweet, id ${tweets[0].id_str}`)
                            embed   .setColor(`#${tweets[0].user.profile_sidebar_border_color}`)
                                    .setAuthor(`${tweets[0].user.name} (@${tweets[0].user.screen_name})`, tweets[0].user.profile_image_url_https.replace("normal.jpg", "200x200.jpg"), `https://twitter.com/${tweets[0].user.screen_name}/status/${tweets[0].id_str}`)
                                    .setDescription(tweets[0].text)
                                    .setTimestamp(tweets[0].created_at)
                            if (tweets[0].entities.media) embed.setImage(tweets[0].entities.media[0].media_url_https)
                            if (g.channels.find(c=>c.id == db.get('channel_id'))) g.channels.find(c=>c.id == db.get('channel_id')).send(embed)
                        } else if (tweets[0].in_reply_to_status_id != null || tweets[0].in_reply_to_user_id != null){
                            if (db.get('reply') === false){
                                if (debug === true) client.shard.send(`[DEBUG: ${functiondate()} - ${functiontime()} - Shard ${client.shard.id + 1} - guild ${g.id} (${g.name}) ] Reply to a tweet, but reply option is off`)
                            } else {
                                if (debug === true) client.shard.send(`[DEBUG: ${functiondate()} - ${functiontime()} - Shard ${client.shard.id + 1} - guild ${g.id} (${g.name}) ] Reply to a tweet, id ${tweets[0].in_reply_to_status_id}`)
                                embed   .setColor(`#${tweets[0].user.profile_sidebar_border_color}`)
                                        .setAuthor(`${tweets[0].user.name} (@${tweets[0].user.screen_name})\nReply to @${tweets[0].in_reply_to_screen_name}`, tweets[0].user.profile_image_url_https.replace("normal.jpg", "200x200.jpg"), `https://twitter.com/${tweets[0].user.screen_name}/status/${tweets[0].id_str}`)
                                        .setDescription(tweets[0].text.replace(`@${tweets[0].in_reply_to_screen_name}`, ""))
                                        .setTimestamp(tweets[0].created_at)
                                        .setThumbnail('https://cdn1.iconfinder.com/data/icons/messaging-3/48/Reply-512.png')
                                if (tweets[0].entities.media) embed.setImage(tweets[0].entities.media[0].media_url_https)
                                if (g.channels.find(c=>c.id == db.get('channel_id'))) g.channels.find(c=>c.id == db.get('channel_id')).send(embed)
                            }
                        }
                    }
                    db.set('old_tweets', tweets[0].id)
                    }catch(e){
                        if (debug === true) client.shard.send(`[ERROR: ${functiondate()} - ${functiontime()} - Shard ${client.shard.id + 1} - guild ${g.id} (${g.name}) ] ` + e)
                        if (debug === true) client.shard.send(tweets[0])
                        if (g.channels.find(c=>c.id == db.get('channel_id'))) g.channels.find(c=>c.id == db.get('channel_id')).send(`https://twitter.com/${tweets[0].user.screen_name}/status/${tweets[0].id_str}`)
                        .catch(err=>client.shard.send(`Error sending on guild ${g.id} - ${g.name}\n${err}`))
                        db.set('old_tweets', tweets[0].id)
                    }
                }
                if (!db.has('old_tweets')) {
                    if (debug === true) client.shard.send(`[DEBUG: ${functiondate()} - ${functiontime()} - Shard ${client.shard.id + 1} - guild ${g.id} ] old_tweets not defined, setting var`)
                    db.set('old_tweets', tweets[0].id)
                }
                await wait(1000)
            })
        });
    } catch (e) {
        client.shard.send(`[${functiondate()} - ${functiontime()} - Shard ${client.shard.id + 1} - Guild ${g.id} (${g.name}) ] globaltwit interval function error:` + e);
    }
    }, 15 * 1000) // 15sec
    
    } catch (e) {
        client.shard.send(`[${functiondate()} - ${functiontime()} - Shard ${client.shard.id + 1} - Guild ${g.id} (${g.name}) ] globaltwit function error:` + e);
    }
}
module.exports = globaltwit
