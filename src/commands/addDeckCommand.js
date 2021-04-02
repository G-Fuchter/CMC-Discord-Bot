const addDeckCommand = {
    name: "add",
    execute(msg, args) {
        console.log("Adding deck");
        msg.reply(`${args} deck added! :0`)
        console.log("Deck added");
    }
}

module.exports = addDeckCommand;