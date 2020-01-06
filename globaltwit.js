const Discord = require('discord.js')
const Enmap = require('enmap')

function globaltwit(twitter_client, client, config, debug, functiondate, functiontime){
    setInterval(function(){
        client.guilds.forEach(async g=>{
            var db = new Enmap({name:'db_'+g.id})
            if (!db.get('channel_id')) return
            var twitter_params = { screen_name: db.has('twitter_name') ? db.get('twitter_name') : undefined}
            if (twitter_params.screen_name === undefined) return

            twitter_client.get('statuses/user_timeline', twitter_params, (err, tweets) => {
                if (err) console.log(err);

                if (db.has('old_tweets') && db.get('old_tweets') === tweets[0].id) {
                    if (debug === true) console.log(`[DEBUG: ${functiondate()} - ${functiontime()} - Shard ${client.shard.id + 1} - Guild ${g.id} ] no new tweets`)
                }
                if (db.has('old_tweets') && db.get('old_tweets') !== tweets[0].id) {
                    try{
                
                        let embed = new Discord.RichEmbed

                    if (tweets[0].retweeted === true || tweets[0].text.startsWith('RT')) {
                        if (db.get('retweet') === true){
                            if (debug === true) console.log(`[DEBUG: ${functiondate()} - ${functiontime()} - Shard ${client.shard.id + 1} - guild ${g.id} ] Retweet from @${tweets[0].retweeted_status.user.screen_name}`)
                            embed   .setColor(`#${tweets[0].retweeted_status.user.profile_sidebar_border_color}`)
                                    .setAuthor(`Retweet\n${tweets[0].retweeted_status.user.name} (@${tweets[0].retweeted_status.user.screen_name})`, tweets[0].retweeted_status.user.profile_image_url_https.replace("normal.jpg", "200x200.jpg"), `https://twitter.com/${tweets[0].user.screen_name}/status/${tweets[0].id_str}`)
                                    .setDescription(tweets[0].retweeted_status.text)
                                    .setTimestamp(tweets[0].retweeted_status.created_at)
                                    .setThumbnail('https://img.icons8.com/color/96/000000/retweet.png')
                            if (tweets[0].retweeted_status.entities.media) embed.setImage(tweets[0].retweeted_status.entities.media[0].media_url_https)
                            if (g.channels.find(c=>c.id == db.get('channel_id'))) g.channels.find(c=>c.id == db.get('channel_id')).send(embed)
                        } else {
                            if (debug === true) console.log(`[DEBUG: ${functiondate()} - ${functiontime()} - Shard ${client.shard.id + 1} - guild ${g.id} ] Retweet from @${tweets[0].retweeted_status.user.screen_name}, but retweet config is disabled`)
                        }
                    } else if (tweets[0].retweeted === false || !tweets[0].text.startsWith('RT')) {
                        if (tweets[0].in_reply_to_status_id === null) {
                            if (debug === true) console.log(`[DEBUG: ${functiondate()} - ${functiontime()} - Shard ${client.shard.id + 1} - guild ${g.id} ] Simple tweet, id ${tweets[0].id_str}`)
                            embed   .setColor(`#${tweets[0].user.profile_sidebar_border_color}`)
                                    .setAuthor(`${tweets[0].user.name} (@${tweets[0].user.screen_name})`, tweets[0].user.profile_image_url_https.replace("normal.jpg", "200x200.jpg"), `https://twitter.com/${tweets[0].user.screen_name}/status/${tweets[0].id_str}`)
                                    .setDescription(tweets[0].text)
                                    .setTimestamp(tweets[0].created_at)
                            if (tweets[0].entities.media) embed.setImage(tweets[0].entities.media[0].media_url_https)
                            if (g.channels.find(c=>c.id == db.get('channel_id'))) g.channels.find(c=>c.id == db.get('channel_id')).send(embed)
                        } else if (tweets[0].in_reply_to_status_id !== null){
                            if (db.get('reply') === false){
                                if (debug === true) console.log(`[DEBUG: ${functiondate()} - ${functiontime()} - Shard ${client.shard.id + 1} - guild ${g.id} ] Reply to a tweet, but reply option is off`)
                            } else {
                                if (!db.has('reply_id')) db.set('reply_id', tweets[0].in_reply_to_status_id)
                                if (db.get('reply_id') == tweets[0].in_reply_to_status_id){
                                    if (debug === true) console.log(`[DEBUG: ${functiondate()} - ${functiontime()} - Shard ${client.shard.id + 1} - guild ${g.id} ] Reply to a tweet, id ${tweets[0].in_reply_to_status_id}`)
                                    db.set('reply_id', tweets[0].in_reply_to_status_id)
                                    embed   .setColor(`#${tweets[0].user.profile_sidebar_border_color}`)
                                            .setAuthor(`${tweets[0].user.name} (@${tweets[0].user.screen_name})\nReply to ${tweets[0].entities.user_mentions[0].name} (@${tweets[0].entities.user_mentions[0].screen_name})`, tweets[0].user.profile_image_url_https.replace("normal.jpg", "200x200.jpg"), `https://twitter.com/${tweets[0].user.screen_name}/status/${tweets[0].id_str}`)
                                            .setDescription(tweets[0].text.replace(`@${tweets[0].entities.user_mentions[0].screen_name}`, ""))
                                            .setTimestamp(tweets[0].created_at)
                                            .setThumbnail('https://cdn1.iconfinder.com/data/icons/messaging-3/48/Reply-512.png')
                                    if (tweets[0].entities.media) embed.setImage(tweets[0].entities.media[0].media_url_https)
                                    if (g.channels.find(c=>c.id == db.get('channel_id'))) g.channels.find(c=>c.id == db.get('channel_id')).send(embed)
                                }
                            }
                        }
                    }
                    db.set('old_tweets', tweets[0].id)
                    }catch(e){
                        if (debug === true) console.error(e)
                        if (g.channels.find(c=>c.id == db.get('channel_id'))) g.channels.find(c=>c.id == db.get('channel_id')).send(`https://twitter.com/${tweets[0].user.screen_name}/status/${tweets[0].id_str}`)
                        .catch(err=>console.error(`Error sending on guild ${g.id} - ${g.name}\n${err}`))
                        db.set('old_tweets', tweets[0].id)
                    }
                }
                if (!db.has('old_tweets')) {
                    if (debug === true) console.log(`[DEBUG: ${functiondate()} - ${functiontime()} - Shard ${client.shard.id + 1} - guild ${g.id} ] old_tweets not defined, setting var`)
                    db.set('old_tweets', tweets[0].id)
                }
             })
        });
    }, 10000)
}
module.exports = globaltwit
