module.exports.run = async (bot,message,args) => {
    message.delete();
    message.channel.send(args.join(" "));
}

module.exports.help = {
    name: "pretend"
}
