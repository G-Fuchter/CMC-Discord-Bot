const deckService = require("../services/deckService");

const checkDecksCommand = {
  name: "check",
  async execute(msg, args) {
    console.log("Checking decks");
    const discordMessage = await deckService.checkDecks(args);
    console.log("Decks checked");
    msg.reply(`${args} decks are in the console boss :0` + "\n" + "`"+ discordMessage + "`");
    console.log(discordMessage);
  },
};

module.exports = checkDecksCommand;
