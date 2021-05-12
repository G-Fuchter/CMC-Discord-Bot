require("dotenv").config();
const Discord = require("discord.js");
const Config = require("./config/config.js");
const {
  getCommandName,
  getCommandArguments,
} = require("./utils/messageParsing");
const { loadCommands } = require("./utils/commandLoading");
const deckService = require("./services/deckService");

async function main() {
  const client = new Discord.Client();
  await deckService.initialize();
  const commands = loadCommands(`${__dirname}/commands`);

  client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });

  client.on("message", (msg) => {
    if (msg.content.startsWith(Config.commandPrefix)) {
      const commandName = getCommandName(Config.commandPrefix, msg.content);
      const args = getCommandArguments(commandName, msg.content);
      try {
        commands[commandName].execute(msg, args);
      } catch (err) {
        console.error(err);
      }
    }
  });

  client.login(Config.discordToken);
}

main();
