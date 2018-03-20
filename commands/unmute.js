const fs = require("fs");

module.exports.run = async (bot,message,args) => {
    //Check if executer has right permissions
    if (!message.member.hasPermission("MANAGE_ROLES")) return message.channel.send("Incorrect permissions (You need the manage roles permissions)");
    //Get mentioned user, return if none
    let mutee = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    if (!mutee) return message.channel.send("User specified is unavailable");

    let role = message.guild.roles.find(r => r.name === "DDA Muted")
    if (!role || !mutee.roles.has(role.id)) return message.channel.send(`${mutee.user.username} is not muted`)

    await mutee.removeRole(role);
    delete bot.mutes[mutee.id];
    fs.writeFile("./mutes.json", JSON.stringify(bot.mutes), err => {
        if (err) throw err;
    });

    message.channel.send(`${mutee.user.username} has been unmuted`)
    return;
}

module.exports.help = {
    name: "unmute"
}