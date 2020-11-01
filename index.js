const Discord = require('discord.js');
const client = new Discord.Client({
  fetchAllMembers: true
});
const wait = require('util').promisify(setTimeout);
const fs = require('fs');
const configfile = "./config.json";
const config = JSON.parse(fs.readFileSync(configfile, "utf8"));

const debug = config.verbose
const publicBot = "661967218174853121"

const Twitter = require('twitter-lite')
var tokens = {
    consumer_key:        config.consumer_key,
    consumer_secret:     config.consumer_secret,
    access_token_key:    config.access_token_key,
    access_token_secret: config.access_token_secret,
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

var old_avatar = undefined
var old_count = undefined
var old_name = undefined

client.on('ready', async () => { 
    try{
        const readylog = `Logged in as ${client.user.tag}!\nOn ${functiondate(0)} at ${functiontime(0)}`
        console.log(readylog);

        var result = await twitter_client.get('users/show', { screen_name: config.twitter_name })
            .catch(err => {
                console.log(`Twitter User GET request error for ${account.name}: ` + err.errors[0].message + ' - ' + err.errors[0].code);
                console.log(err)
                if (err.errors[0].code == 50 || err.errors[0].code == 63 || err.errors[0].code == 32) {
                    console.error('Account not found!')
                    process.exit(1)
                }
                return
            })
        var acc_id = result.id_str

        const twit = require('./twitter-function.js')
        twit(twitter_client, acc_id, client, config, debug, functiondate, functiontime, old_avatar, old_count, old_name)

   }catch(err){
        console.error(err)
   }
})

client.on('guildCreate', guild => {
    try{
    if (client.user.id === publicBot){
        const Enmap = require('enmap')
        const db = new Enmap({name:'db_' + guild.id})
    }
    const botjoinguildlog = `${client.user.username} joined ${guild.name} - ID: ${guild.id}`
    console.log(`[${functiondate(0)} - ${functiontime(0)}] ${botjoinguildlog}`)
    if (client.user.id === publicBot) dbl.postStats(client.guilds.size, client.shard.Id, client.shard.count);
}catch(e){
    console.error(e)
}
})

client.on('guildDelete', guild => {
    try{
        if (client.user.id === publicBot){
            const Enmap = require('enmap')
            const db = new Enmap({name:'db_' + guild.id})
            db.destroy()
        }
        const botleftguildlog = `${client.user.username} left ${guild.name} - ID: ${guild.id}`
        console.log(`[${functiondate(0)} - ${functiontime(0)}] ${botleftguildlog}`)
        if (client.user.id === publicBot) dbl.postStats(client.guilds.size, client.shard.Id, client.shard.count);
    } catch(e) {
        console.error(e)
    }
})

client.on('disconnect', event => {
    const eventmsg = `Bot down : code ${event.code}: "${event.reason}"`
    console.log(`[${functiondate(0)} - ${functiontime(0)}] ` + eventmsg)
})

client.login(config.discord_token)
