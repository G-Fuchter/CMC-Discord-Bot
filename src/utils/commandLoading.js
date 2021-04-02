const fs = require("fs");

exports.loadCommands = (commandsPath) => {
    const commands = {};
    const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
    const command = require(`${commandsPath}/${file}`);
    commands[command.name] = command;
    }
    return commands;
}