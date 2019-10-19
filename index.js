const Discord = require('discord.js');
const client = new Discord.Client({
  fetchAllMembers: true
});
const fs = require('fs');
const configfile = "./config.json";
const config = JSON.parse(fs.readFileSync(configfile, "utf8"));

const tweet_channel = client.channels.get(config.channel_id)

const Twitter = require('twitter')
const tokens = {
    consumer_key:        config.consumer_key,
    consumer_secret:     config.consumer_secret,
    access_token:        config.access_token_key,
    access_token_key:    config.access_token_key,
    access_token_secret: config.access_token_secret
};

const twitter_client = new Twitter(tokens);
const twitter_params = { screen_name: config.twitter_name };


function functiondate() { 
    const datefu = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const year = datefu.getFullYear();
    const month = months[datefu.getMonth()];
    const getdate = datefu.getDate();
    const date = getdate + ' ' + month + ' ' + year;
    return date;
};

function functiontime() {
    const datefu = new Date();
    const hour = datefu.getHours();
    const min = datefu.getMinutes();
    const sec = datefu.getSeconds();
    const time = hour + ':' + min + ':' + sec;
    return time
}

var old_avatar = undefined
var old_tweets = undefined

client.on('ready', () => { 
    try{
    const readylog = `Logged in as ${client.user.tag}!\nOn ${functiondate(0)} at ${functiontime(0)}`
    console.log(readylog);
    client.user.setActivity('Starting... Please wait 1 min', { type: 'WATCHING' });
    console.log('Please wait while we start the bot, it takes ~ 1 min')

    setInterval(function(){
            twitter_client.get('statuses/user_timeline', twitter_params, (err, tweets) => {
                console.log('Refreshing status...')
                if (err) console.log(err);
                
                client.user.setActivity(`${tweets[0].user.followers_count} followers`, { type: 'WATCHING' })

                if (old_avatar && old_avatar !== tweets[0].user.profile_image_url_https){
                    console.log(`[DEBUG: ${functiondate()} - ${functiontime()}] avatar changed, setting in Discord...`)
                    client.user.setAvatar(tweets[0].user.profile_image_url_https).catch(err=>console.log(`[${functiondate()} - ${functiontime()}] ${err}`))
                    old_avatar = tweets[0].user.profile_image_url_https
                }
                if (old_avatar && old_avatar === tweets[0].user.profile_image_url_https) {
                    console.log(`[DEBUG: ${functiondate()} - ${functiontime()}] avatar not changed`)
                }
                if (!old_avatar){
                    console.log(`[DEBUG: ${functiondate()} - ${functiontime()}] old_avatar not defined, setting var`)
                    old_avatar = tweets[0].user.profile_image_url_https
                }
                
                if (old_tweets && old_tweets !== tweets[0].id) {
                    console.log(`[DEBUG: ${functiondate()} - ${functiontime()}] new tweet! sending in Discord...`)
                    let embed = new Discord.RichEmbed
                    embed   .setColor(`#${tweets[0].user.profile_background_color}`)
                            .setAuthor(`${tweets[0].user.name} (@${tweets[0].user.screen_name})`, tweets[0].user.profile_image_url_https, `https://twitter.com/${tweets[0].user.screen_name}/status/${tweets[0].id_str}`)
                            .setDescription(tweets[0].text)
                            .setTimestamp(tweets[0].created_at)
                            .setFooter(`Likes: ${tweets[0].favorite_count}`);
                    if (tweets[0].truncated === true) embed.setImage(tweets[0].entities.urls[0])

                    client.channels.get(config.channel_id).send(embed).catch(err=>console.log(`[${functiondate()} - ${functiontime()}] ${err}`))
                    old_tweets = tweets[0].id
                }
                if (old_tweets && old_tweets === tweets[0].id) {
                    console.log(`[DEBUG: ${functiondate()} - ${functiontime()}] no new tweets`)
                }
                if (!old_tweets) {
                    console.log(`[DEBUG: ${functiondate()} - ${functiontime()}] old_tweets not defined, setting var`)
                    old_tweets = tweets[0].id
                }

                console.log(`[DEBUG: ${functiondate()} - ${functiontime()}]\nold tweet: ${old_tweets}\nnew tweet: ${tweets[0].id}\nold avatar: ${old_avatar}\nnew avatar: ${tweets[0].user.profile_image_url_https}`)
                
             });
        }, 5000)
   }catch(err){
      console.log(`[${functiondate()} - ${functiontime()}] ${err}`)
   }
})

client.on('message', message => {
    try {
    
    } catch (e) {
        console.log(e)
        getlogchannel().send(`**Message event ERROR** : ${e}`)
    }
});

client.on('guildCreate', guild => {
    const botjoinguildlog = `${client.user.username} joined __${guild.name}__\n*ID: ${guild.id}*`
    console.log(`[${functiondate(0)} - ${functiontime(0)}]\n${botjoinguildlog}`)
})

client.on('guildDelete', guild => {
    const botleftguildlog = `${client.user.username} left __${guild.name}__\n*ID: ${guild.id}*`
    console.log(`[${functiondate(0)} - ${functiontime(0)}]\n${botleftguildlog}`)
})

client.on('disconnect', event => {
    var eventcodemsg = 'Event Code Message not set for this code'
    if (event = '1000') eventcodemsg = 'Normal closure'
    if (event = '1001') eventcodemsg = 'Can\'t connect to WebSocket'
    const eventmsg = `Bot down : code ${event}: "${eventcodemsg}"`
    console.log(`[${functiondate(0)} - ${functiontime(0)}] ` + eventmsg)
    getlogchannel().send(eventmsg)
})

client.on('reconnecting', () => {
    const eventmsg = `reconnecting to WebSocket`
    console.log(`[${functiondate(0)} - ${functiontime(0)}] ` + eventmsg)
})

client.login(config.discord_token)
