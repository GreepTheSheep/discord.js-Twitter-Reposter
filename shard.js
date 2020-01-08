const config = require('./config.json')

const { ShardingManager } = require('discord.js');
const shard = new ShardingManager('./index.js', {
  token: config.discord_token,
  autoSpawn: true
});

shard.spawn().catch(e=>console.error(e));

shard.on('launch', shard => console.log(`[SHARD] Shard ${shard.id + 1}`));

shard.on('message', (shard, message) => {
  if (message._eval){
    console.log(`Shard[${shard.id + 1}] : ${message._eval} : ${message._result}`);
    console.log(message._result)
  } else {
    console.log(message)
  }
});