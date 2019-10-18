const Discord = require('discord.js');
const client = new Discord.Client({
  fetchAllMembers: true
});
const fs = require('fs');
const configfile = "./config.json";
const config = JSON.parse(fs.readFileSync(configfile, "utf8"));
const shell = require('shelljs');


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
    const readylog = `Logged in as ${client.user.tag}!\nOn ${functiondate(0)} at ${functiontime(0)}`
    console.log(readylog);
    
    const autopull = new Promise(function() {
        setInterval(function() {
            getlogchannel().send('Pulling changes from GitHub...')
            .then(m=>shell.exec('git pull'), function(code, stdout, stderr){
                if (code != 0) return m.edit(`Error during pulling: \`\`\`${stderr}\`\`\``)
                m.edit(`\`\`\`${stdout}\`\`\` :white_check_mark:`)
            })
        }, 8.64e+7);
    }).catch(err=>getlogchannel().send('Error during auto pull: ' + err))
    autopull
});

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

client.login(config.token)
