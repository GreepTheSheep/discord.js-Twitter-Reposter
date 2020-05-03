try{
const Discord = require('discord.js');
const client = new Discord.Client({
  fetchAllMembers: true
});
const fs = require('fs');
const config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
if (client.shard.count == 0) client.shard.send = (m) => console.log(m)
const debug = config.verbose
const publicBot = "706587515771158560"

const Twitter = require('twitter')
const tokens = {
    consumer_key:        config.consumer_key,
    consumer_secret:     config.consumer_secret,
    access_token:        config.access_token_key,
    access_token_key:    config.access_token_key,
    access_token_secret: config.access_token_secret
};

const twitter_client = new Twitter(tokens);

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

client.on('ready', () => { 
    try{
    const readylog = `Logged in as ${client.user.tag}!\nOn ${functiondate(0)} at ${functiontime(0)}`
    client.shard.send(readylog);

    if (client.user.id === publicBot){
        client.user.setActivity('your Twitter feed | Mention me to setup!', { type: 'WATCHING' })
        const globaltwit = require('./globaltwit.js')
        globaltwit(twitter_client, client, config, debug, functiondate, functiontime)
    } else {
        var twitter_params = { screen_name: config.twitter_name };
        var old_avatar = undefined
        var old_tweets = undefined
        var old_count = undefined
        var old_name = undefined
        const twit = require('./twitter-function.js')
        twit(twitter_client, twitter_params, client, config, debug, functiondate, functiontime, old_avatar, old_count, old_name, old_tweets)
    }

   }catch(err){
        client.shard.send(`[${functiondate()} - ${functiontime()}] ${err}`)
   }
})

client.on('message', message =>{
    if (message.channel.type === 'dm') return
    if (message.author.bot) return;
    if (client.user.id === publicBot){
        const cmds_index = require('./cmds/cmds-index.js')
        cmds_index(message, client, config, functiondate, functiontime, publicBot)
    }
})

client.on('guildCreate', guild => {
    if (client.user.id === publicBot){
        const Enmap = require('enmap')
        const db = new Enmap({name:'db_' + guild.id})
    }
    const botjoinguildlog = `${client.user.username} joined __${guild.name}__\n*ID: ${guild.id}*`
    client.shard.send(`[${functiondate(0)} - ${functiontime(0)}]\n${botjoinguildlog}`)
})

client.on('guildDelete', guild => {
    if (client.user.id === publicBot){
        const Enmap = require('enmap')
        const db = new Enmap({name:'db_' + guild.id})
        db.destroy()
    }
    const botleftguildlog = `${client.user.username} left __${guild.name}__\n*ID: ${guild.id}*`
    client.shard.send(`[${functiondate(0)} - ${functiontime(0)}]\n${botleftguildlog}`)
})

client.on('disconnect', event => {
    const eventmsg = `Bot down : code ${event.code}: "${event.reason}"`
    client.shard.send(`[${functiondate(0)} - ${functiontime(0)}] ` + eventmsg)
})

client.on('reconnecting', () => {
    const eventmsg = `reconnecting to WebSocket`
    client.shard.send(`[${functiondate(0)} - ${functiontime(0)}] ` + eventmsg)
})

client.login(config.discord_token)
}catch(e){
    client.shard.send(e)
}
