const Discord = require('discord.js');
const client = new Discord.Client({
  fetchAllMembers: true
});
const wait = require('util').promisify(setTimeout);
const fs = require('fs');
const configfile = "./config.json";
const config = JSON.parse(fs.readFileSync(configfile, "utf8"));

const debug = config.verbose

const Twitter = require('twitter-lite')
var tokens = {
    consumer_key:        config.consumer_key,
    consumer_secret:     config.consumer_secret,
    access_token_key:    config.access_token_key,
    access_token_secret: config.access_token_secret,
};

const twitter_client = new Twitter(tokens);

var twtaccounts = []
config.accounts.forEach(async acc=>{
    var result = await twitter_client.get('users/show', { screen_name: acc.twitter_name })
    .catch(err => {
        console.log(`Twitter User GET request error for ${account.name}: ` + err.errors[0].message + ' - ' + err.errors[0].code);
        console.log(err)
        if (err.errors[0].code == 50 || err.errors[0].code == 63 || err.errors[0].code == 32) {
            console.error('Account not found!')
            process.exit(1)
        }
        return
    })
    twtaccounts.push({
        "id" : result.id_str,
        "twitter_name" : acc.twitter_name,
        "channel_id" : acc.channel_id,
        "embed_color" : acc.embed_color,
        "retweet": acc.retweet,
        "reply": acc.reply
    })
})


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
        console.log(`${config.accounts.length} accounts set`)

        if (config.accounts.length == 1) require('./check-user.js')(client, config, debug, twitter_client, old_avatar, old_count, old_name)
        
        require('./twitter-function.js')(twitter_client, client, twtaccounts, debug, functiondate, functiontime)

   }catch(err){
        console.error(err)
   }
})

client.on('guildCreate', guild => {
    try{
    const botjoinguildlog = `${client.user.username} joined ${guild.name} - ID: ${guild.id}`
    console.log(`[${functiondate(0)} - ${functiontime(0)}] ${botjoinguildlog}`)
}catch(e){
    console.error(e)
}
})

client.on('guildDelete', guild => {
    try{
        const botleftguildlog = `${client.user.username} left ${guild.name} - ID: ${guild.id}`
        console.log(`[${functiondate(0)} - ${functiontime(0)}] ${botleftguildlog}`)
    } catch(e) {
        console.error(e)
    }
})

client.on('disconnect', event => {
    const eventmsg = `Bot down : code ${event.code}: "${event.reason}"`
    console.log(`[${functiondate(0)} - ${functiontime(0)}] ` + eventmsg)
})

client.login(config.discord_token)
