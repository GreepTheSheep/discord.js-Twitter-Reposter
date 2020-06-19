const Discord = require('discord.js')
const Enmap = require('enmap')

async function premium(message, client, config, functiondate, functiontime, publicBot, db, prefix, prefix2, embed){
    if (message.content.toLowerCase() == prefix + ' premium' || message.content.toLowerCase() == prefix2 + ' premium'){
        const awaitmsg = await message.channel.send('awaitng guild id...')
        var db
        const filter = m => message.author == m.author;
        const collectorguild = message.channel.createMessageCollector(filter, {time: 30000, max: 1});
        collectorguild.on('collect', m => {
            var gu = client.guilds.some(g=> g.id == m.content)
            if (gu) db = new Enmap({name:'db_'+m.content})
            else if (!gu) return m.react('❌')
            if (db.get('premium') == false){
                db.set('premium', true)
                message.reply(`Premium for guild ${m.content} (${client.guilds.find(g=>g.id == m.content).name}) is **enabled**`)
            } else {
                db.set('premium', false)
                message.reply(`Premium for guild ${m.content} (${client.guilds.find(g=>g.id == m.content).name}) is **disabled**`)
            }
            
            });
        collectorguild.on('end', (collected, reason) => {
            if (reason == 'time'){
                message.reply('time\'s up')
            }
        });
    }
}

module.exports = premium