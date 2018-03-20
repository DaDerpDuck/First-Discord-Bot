module.exports.run = async (bot,message,args) => {
    //Check if executer has right permissions
    if (!message.member.hasPermission("MANAGE_ROLES")) return message.channel.send("Incorrect permissions (You need the manage roles permissions)");
    //Get mentioned user, return if none
    let target = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    if (!target) return message.channel.send("You must specify an available user!");
    //Check if target has higher roles
    if (target.id === message.author.id) return message.channel.send("You cannot strip yourself");
    if (target.user.bot) return message.channel.send("You cannot strip a bot");
    if (target.highestRole.position >= message.member.highestRole.position) return message.channel.send("You cannot strip someone with a higher/same role as you");
    target.removeRoles(target.roles).catch(console.error);
    message.channel.send(`${target.user.username} has been stripped from all their roles`)
}

module.exports.help = {
    name: "striproles"
}