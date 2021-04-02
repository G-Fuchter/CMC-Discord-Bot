exports.getCommandName = (prefix, msg) => {
    indexOfEndOfCommand = msg.indexOf(" ");
    if (indexOfEndOfCommand === -1) {
       indexOfEndOfCommand = msg.length; 
    }
    return msg.substring(prefix.length, indexOfEndOfCommand);
}

exports.getCommandArguments = (commandName, msg) => {
    const startOfArguments = msg.indexOf(commandName) + commandName.length + 1;
    return msg.substring(startOfArguments);
}
