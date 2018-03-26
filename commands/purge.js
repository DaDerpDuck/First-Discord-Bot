const Discord = module.require("discord.js")

module.exports.run = async (bot,message,args) => {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Incorrect permissions (You need the manage messages permissions)");
    if (!args[0]) return message.channel.send("Provide amount of messages to delete");
    if (!Number(args[0])) return message.channel.send("Provide a number of messages to delete");
    let fetched = await message.channel.fetchMessages({limit: args[0]});
    await message.channel.bulkDelete(fetched + 1)
    let embed = new Discord.RichEmbed()
        .setAuthor(`Purge Command`)
        .setDescription(`Deleted ${args[0]} messages!`)
        .setColor("#9B59B6");
    message.channel.send({embed: embed});
}

module.exports.help = {
    name: "purge"
}
