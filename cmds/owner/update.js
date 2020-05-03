const Discord = require('discord.js')

function update(message, client, config, functiondate, functiontime, publicBot, db, prefix, prefix2, embed) {
    if (message.content.toLowerCase() == prefix + ' update' || message.content.toLowerCase() == prefix2 + ' update'){
            try {
                message.channel.startTyping()
                shell.exec('git pull && npm install && pm2 reload ecosystem.config.js', {silent:true}, function(code, stdout, stderr) {
                    message.reply(`Output:\n\`\`\`${stdout}${stderr}\`\`\``).then(m=>message.channel.stopTyping(true));
                });
            } catch (err) {
                message.reply(`EVAL **__ERROR__**\n\`\`\`xl\n'pm2 stop GL && git pull && npm install && pm2 start GL'\`\`\``);
                message.channel.stopTyping(true)
            }
    }
}

module.exports = update