const Discord = require('discord.js');
const Config = require('./config/config.json');

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});


client.on('message', msg => {
  if (msg.content === 'lmao') {
    msg.reply('Pong!');
  }
});

client.login(Config.discordToken);