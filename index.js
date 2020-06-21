try{
const Discord = require('discord.js');
const client = new Discord.Client({
  fetchAllMembers: true
});
const wait = require('util').promisify(setTimeout);
const fs = require('fs');
const config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
const DBL = require("dblapi.js");
const dbl = new DBL(config.topgg_token, client);
if (client.shard.count == 0) client.shard.send = (m) => console.log(m)
const debug = config.verbose
const publicBot = "661967218174853121"

const Twitter = require('twit')
var tokens = {
    consumer_key:        config.consumer_key,
    consumer_secret:     config.consumer_secret,
    access_token:        config.access_token_key,
    access_token_key:    config.access_token_key,
    access_token_secret: config.access_token_secret,
    safe: false
};

const twitter_client = new Twitter(tokens);
var twit_send = false

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
        const actmsgs = [
            'your Twitter feed',
            'mention me to setup!',
            'VERSION 3 OPEN BETA',
            'if all is set up correctly',
            `if Twitter is not down...`,
            `funny memes on Twitter`,
            `${client.guilds.size} servers on shard ${client.shard.id + 1}`,
            'issues on GitHub',
            'bots on Twitter',
            'cute cats images on Twitter',
            'Elon Musk\'s Twitter feed',
            'NASA\'s image of the day'
        ];
        
        function randomItem(array) {
            return array[Math.floor(Math.random() * array.length)];
        }
        
        client.user.setActivity('', { type: 'WATCHING' })
        const actfunction = new Promise(async function(resolve, reject) {
            if (!twit_send) {
                client.user.setStatus('dnd')
                client.user.setActivity(`🟠 Starting in MAINTENANCE mode`, { type: 'WATCHING' })
                client.shard.send(`Shard ${client.shard.id + 1} - Maintenance enabled`)
            }
            else {
                client.user.setStatus('online')
                client.user.setActivity(`${client.user.username} is starting...`, { type: 'WATCHING' })
                client.shard.send(`Shard ${client.shard.id + 1} - Maintenance disabled`)
            }
            await wait(2*60*1000)
            client.user.setActivity(`${client.guilds.size} servers on shard ${client.shard.id + 1}`, { type: 'WATCHING' })
            setInterval(function() {
                if (!twit_send) {
                    client.user.setStatus('dnd')
                    client.user.setActivity(`🛠 MAINTENANCE`, { type: 'WATCHING' })
                }
                else {
                    client.user.setStatus('online')
                    let actmsg = randomItem(actmsgs);
                    client.user.setActivity(actmsg, { type: 'WATCHING' })
                }
                dbl.postStats(client.guilds.size, client.shard.id, client.shard.count);
            }, 5 * 60 * 1000);
        });

        dbl.postStats(client.guilds.size, client.shard.id, client.shard.count);

        const globaltwit = require('./globaltwit.js')
        globaltwit(twitter_client, tokens, client, config, debug, functiondate, functiontime, twit_send)
        
        actfunction
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
        client.shard.send(err)
   }
})

client.on('message', message =>{
    if (message.channel.type === 'dm') return
    if (message.author.bot) return;
    if (client.user.id === publicBot){
        const cmds_index = require('./cmds/cmds-index.js')
        cmds_index(message, client, config, functiondate, functiontime, publicBot, twitter_client, dbl, twit_send)
    }
})

client.on('guildCreate', guild => {
    if (client.user.id === publicBot){
        const Enmap = require('enmap')
        const db = new Enmap({name:'db_' + guild.id})
    }
    const botjoinguildlog = `${client.user.username} joined ${guild.name} - ID: ${guild.id}`
    client.shard.send(`[${functiondate(0)} - ${functiontime(0)}] ${botjoinguildlog}`)
    dbl.postStats(client.guilds.size, client.shard.Id, client.shard.count);
})

client.on('guildDelete', guild => {
    if (client.user.id === publicBot){
        const Enmap = require('enmap')
        const db = new Enmap({name:'db_' + guild.id})
        db.destroy()
    }
    const botleftguildlog = `${client.user.username} left ${guild.name} - ID: ${guild.id}`
    client.shard.send(`[${functiondate(0)} - ${functiontime(0)}] ${botleftguildlog}`)
    dbl.postStats(client.guilds.size, client.shard.Id, client.shard.count);
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

dbl.on('posted', () => {
    client.shard.send('Server count posted on top.gg!');
})
  
dbl.on('error', e => {
    client.shard.send(`top.gg error! ${e}`);
})
}catch(e){
    client.shard.send(e)
}
