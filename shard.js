const config = require('./config.json')

const { ShardingManager } = require('discord.js');
const shard = new ShardingManager('./index.js', {
  token: config.discord_token,
  autoSpawn: true
});

shard.spawn();

shard.on('launch', shard => console.log(`[SHARD] Shard ${shard.id + 1}`));
