module.exports.run = async (bot,message,args) => {
    message.channel.send(`Ping: ${new Date().getTime() - message.createdTimestamp}ms`);
    return;
}

module.exports.help = {
    name: "ping"
}