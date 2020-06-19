const Discord = require('discord.js');
const client = new Discord.Client();
const Enmap = require('enmap')
const fs = require('fs');
const config = JSON.parse(fs.readFileSync("./config.json", "utf8"));

const shell = require('shelljs');
const prompt = require('prompt');
const colors = require("colors/safe");
const wait = require('util').promisify(setTimeout);
const os = require('os');
const package = JSON.parse(fs.readFileSync("./package.json", "utf8"));
const request = require('request')

startscreen()

async function startscreen(){
    console.log('\033[2J');
    console.log('┌─────────────────────────────────┐')
    console.log('│         ' + colors.bold(colors.rainbow('Twitter Reposter')) + '        │')
    console.log('│                                 │')
    console.log('│        Database Migration       │')
    console.log('│             By Greep            │')
    console.log('└─────────────────────────────────┘')
    console.log(colors.grey(package.repository.url))
    discord_login()
}

async function discord_login(){
    await wait(1000)
    console.log('\n')
    console.log('Logging in with Discord bot token...')
    await wait(1500)
    client.login(config.discord_token).catch(err=>{
        console.error(colors.red('ERROR!'))
        console.error(err)
    })

    client.on('ready', async () => {
        console.log(colors.green(`Logged in as ${client.user.tag}!`));
        client.user.setStatus('invisible')
        console.log(colors.grey('Checking guilds list...'))
        await wait(500)
        console.log(colors.blue(`Found ${client.guilds.size} guilds`))
        confirmation()
    }); 
}

async function confirmation(){
    await wait(1000)
    var schema = {
        properties: {
          confirm: {
            description: colors.white(colors.underline('Are you sure to continue?') + ' (yes/no):'),
            type: 'string',
            pattern: /^\w+$/,
            default: 'no',
            required: true
          }
        }
    };
    prompt.message = '';
    prompt.delimiter = '';
    prompt.start();
    prompt.get(schema, function (err, result) {
        if (result.confirm.toLowerCase().includes('no')){
            console.log(colors.italic('Exiting...'))
            process.exit(0)
        } else {
            migrate()
        }
    })
}

async function migrate(){
    console.log(colors.bold(colors.cyan('Starting migration process...')))
    client.user.setStatus('dnd')
    client.user.setActivity('Database migration in progress...', { type: 'PLAYING' })
    await wait(1500)
    
    client.guilds.forEach(g=>guildmigration(g))

    end()
}

async function guildmigration(g){
    try{
    await wait(500)
    var db = new Enmap({name:'db_'+g.id})

    var nameok = false
    var channelok = false
    if (!db.has('twitter_name') || !db.has('channel_id')) return console.log(colors.yellow(`🟧 ${g.id} (${g.name}) : Nothing set, skipping migration for this guild`))
    if (db.get('twitter_name') !== Array || db.get('twitter_name') == String){
        var twitter = db.get('twitter_name')
        db.set('twitter_name', [twitter])
        nameok = true
    }
    if (db.get('channel_id') !== Array || db.get('channel_id') == String){
        var id = db.get('channel_id')
        db.set('channel_id', [id])
        channelok = true
    }
    if (db.get('old_tweets') !== Array || db.get('old_tweets') == String){
        var old = db.get('old_tweets')
        db.set('old_tweets', [old])
    }
    if (db.get('reply') !== Array || db.get('reply') == String){
        var rp = db.get('reply')
        db.set('reply', [rp])
    }
    if (db.get('retweet') !== Array || db.get('retweet') == String){
        var rt = db.get('retweet')
        db.set('retweet', [rt])
    }
    if (nameok == true && channelok == true) console.log(colors.green(`✅ ${g.id} (${g.name}) : Twitter account: @${db.get('twitter_name')[0]} -- Channel ID : ${db.get('channel_id')[0]}`))
    else {
        console.error(`🟥 ${g.id} (${g.name}) : ${nameok ? 'Username: OK' : colors.bgRed('Username: Error')} - ${channelok ? 'Channel ID: OK' : colors.bgRed('Channel ID: error')}`)
        console.error('Retrying...')
        guildmigration(g)
    }
    } catch (err) {
        console.error(colors.bgRed(`🟥 ${g.id} (${g.name}) : ${err}`))
    }
}

async function end(){
    await wait(2000)

    console.log('\n')
    console.log(colors.rainbow('┌─────────────────────────────────┐'))
    console.log(colors.rainbow('|            ✅ Done! ✅          |'))
    console.log(colors.rainbow('└─────────────────────────────────┘'))
    console.log('')
    console.log('Migration finished! Thanks for your patience')

    console.log(colors.green('\nThanks for using Twitter Reposter 💙'))
    console.log('')
    process.exit(0)
}
