const Discord = require('discord.js')

function ownercmds(message, client, config, functiondate, functiontime, publics, db, prefix, embed){

    const guildinfo = require('./guild-info.js')
    guildinfo(message, client, config, functiondate, functiontime, publics, db, prefix, embed)

    const guildlist = require('./guild-list.js')
    guildlist(message, client, config, functiondate, functiontime, publics, db, prefix, embed)

    const shardinfo = require('./shard-info.js')
    shardinfo(message, client, config, functiondate, functiontime, publics, db, prefix, embed)

    const update = require('./update.js')
    update(message, client, config, functiondate, functiontime, publics, db, prefix, embed)

}

module.exports = ownercmds