const Discord = require('discord.js')
const Enmap = require('enmap')

function check_number_of_accounts(client, config, debug, functiondate, functiontime, twit_send){
    try{
        var twitter_accounts_num = 0;
        client.guilds.forEach(async g=>{
            var db = new Enmap({name:'db_'+g.id})
            var twitter_accounts = db.has('twitter_name') ? db.get('twitter_name') : undefined
            if (twitter_accounts === undefined) return
            twitter_accounts.forEach(twitter_accounts_num++)
        })
        if (twitter_accounts_num == 4999) {
            client.shard.broadcastEval(`{
                twit_send = false
                client.user.setStatus('dnd')
                client.user.setActivity(\`🟠 Starting MAINTENANCE mode\`, { type: 'WATCHING' })
                client.shard.send(\`Shard \${client.shard.id + 1} - Maintenance enabled\`)
            }`)
            
            client.users.find(u=> u.id == config.owner_id).send(`:warning: 5000/5000 accounts linked. Maintenance enabled, find a new solution`)
        } else if (twitter_accounts_num >= 4900) {
            client.users.find(u=> u.id == config.owner_id).send(`:warning: ${client.user.username} has reached ${twitter_accounts_num} accounts linked of 5000.`)
        }
    }catch(e){
        client.shard.send(e)
    }
}

module.exports = check_number_of_accounts