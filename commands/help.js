const Discord = module.require("discord.js");
const cmdlist = [
    "avatar",
    "userinfo",
    "ping",
    "say",
    "music",
    "weather",
    "coinflip",
    "dieroll",
    "diceroll",
    "randnum",
    "purge",
    "striproles",
    "mute",
    "unmute",
    "kick"
]

module.exports.run = async (bot,message,args) => {
    let cmds = "";
    cmdlist.forEach((v,i) => {
        if (i < cmdlist.length-1) {
            cmds += `\`${cmdlist[i]}\`, `;
        } else {
            cmds += `\`${cmdlist[i]}\``;
        }
    });
    let embed = new Discord.RichEmbed()
        .setAuthor("Available Commands")
        .setDescription(cmds)
        .setColor("#9B59B6")
    message.channel.send({embed: embed})
}

module.exports.help = {
    name: "help"
}