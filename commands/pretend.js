module.exports.run = async (bot,message,args) => {
    const target = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]) || message.guild.member(message.author);
    if (!target.bot) return message.channel.send("Sorry, this command only works on bots!");
    message.delete();
    message.channel.send(args.shift().join(" "));
}

module.exports.help = {
    name: "pretend"
}
