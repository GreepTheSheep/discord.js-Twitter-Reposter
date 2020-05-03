const Discord = require('discord.js')

function ownercmds(message, client, config, functiondate, functiontime, publicBot, db, prefix, prefix2, embed){

    const guildinfo = require('./guild-info.js')
    guildinfo(message, client, config, functiondate, functiontime, publicBot, db, prefix, prefix2, embed)

    const guildlist = require('./guild-list.js')
    guildlist(message, client, config, functiondate, functiontime, publicBot, db, prefix, prefix2, embed)

    const shardinfo = require('./shard-info.js')
    shardinfo(message, client, config, functiondate, functiontime, publicBot, db, prefix, prefix2, embed)

    const update = require('./update.js')
    update(message, client, config, functiondate, functiontime, publicBot, db, prefix, prefix2, embed)

}

module.exports = ownercmds