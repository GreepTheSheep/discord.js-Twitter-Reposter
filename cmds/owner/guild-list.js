const Discord = require('discord.js')
const Enmap = require('enmap')
const fs = require('fs')

function guildlist(message, client, config, functiondate, functiontime, publicBot, db, prefix, prefix2, embed) {
    if (message.content.toLowerCase() == prefix + ' glist' || message.content.toLowerCase() == prefix2 + ' glist'){
            try {
                tryfunction(message, client, config, functiondate, functiontime, publicBot, db, prefix, prefix2, embed)
            } catch (err) {
                message.delete();
                message.author.send('I can\'t get the list, try again\nError: ' + err)
            }
    }
}

async function tryfunction(message, client, config, functiondate, functiontime, publicBot, db, prefix, prefix2, embed){
    message.delete()
    var glistarray = []
    client.guilds.forEach(g=>{
        db = new Enmap({name:'db_'+g.id})
        glistarray.push(`${g.name} (${g.id}) : Shard ${db.get('shard_id')} - ${db.has('twitter_name') ? `Premium: ${db.get('premium')} - JSON data: ${db.get('twitter_name')}` : `Nothing set`}`)
    })
    let values = await client.shard.broadcastEval(`
        [
            this.shard.id,
            this.guilds.size
        ]
    `);
    var totalServ = 0
    var totalShardList = 1
    values.forEach((value) => {
        totalServ = totalServ + value[1]
        totalShardList = totalShardList++
    });
    glistarray.push(`\nTotal Guilds: ${totalServ} - Total shards: ${totalShardList}`)
    var filedata = glistarray.join('\n')
    fs.writeFileSync('./data/glist.txt', filedata)
    const attachment = new Discord.Attachment('./data/glist.txt')
    message.author.send('Here is the list of guilds, ' + message.author.username, attachment)
}

module.exports = guildlist