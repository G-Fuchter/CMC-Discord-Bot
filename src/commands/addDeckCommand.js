const deckService = require("../services/deckService");
const config = require("../config/config.json");

const addDeckCommand = {
  name: "add",
  async execute(msg, args) {
    console.log("Adding deck");
    await deckService.addDeck(args);
    msg.reply(`${args} deck added! :0`);
    console.log("Deck added");
  },
};

module.exports = addDeckCommand;
