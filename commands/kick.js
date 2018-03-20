module.exports.run = async (bot,message,args) => {
        //Check if executer has right permissions
        if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("Incorrect permissions (You need the kick members permissions)");
        //Get mentioned user, return if none
        let target = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
        if (!target) return message.channel.send("You must specify an available user!");
        //Check if target has higher roles
        if (target.highestRole.position >= message.member.highestRole.position) return message.channel.send("You cannot kick someone with a higher/same role as you");
        target.kick();
        message.channel.send(`${target.user.username} has been kicked`);
}

module.exports.help = {
    name: "kick"
}