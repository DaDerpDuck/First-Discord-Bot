const Discord = module.require("discord.js")
const desc = [
    "Someone you know?",
    "Possibly a stranger?",
    "This person again...",
    "Stalking mode activated!",
    "Someone important?",
    "A friend or a foe?",
    "Here's what I got"
];

module.exports.run = async (bot,message,args) => {
    let descRand = desc[Math.floor(Math.random()*desc.length)];
    let target = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]) || message.guild.member(message.author);
    let creationDate = target.user.createdAt;
    let joinDate = target.joinedAt;
    let embed = new Discord.RichEmbed()
        .setAuthor(`${target.user.username}#${target.user.discriminator}`,target.user.displayAvatarURL)
        .setDescription(descRand)
        .setColor("#9B59B6")
        .addField("ID", target.user.id)
        .addField("Creation Date", `${creationDate.getMonth()+1}/${creationDate.getDate()}/${creationDate.getFullYear()}`,true)
        .addField("Join Date", `${joinDate.getMonth()+1}/${joinDate.getDate()}/${joinDate.getFullYear()}`,true)
    message.channel.send({embed: embed});
}

module.exports.help = {
    name: "userinfo"
}