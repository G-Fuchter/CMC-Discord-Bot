const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});


client.on('message', msg => {
  if (msg.content === 'lmao') {
    msg.reply('Pong!');
  }
});

client.login('ODI2ODc3OTM2NTE4ODI0MDA3.YGS4Fg.hhKL0j4YpDXVlwbos4kVP-knoVs');