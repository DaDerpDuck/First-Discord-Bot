module.exports.run = async (bot,message,args) => {
    let target = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    let msg = await message.channel.send("Loading image...");
    if (!target) {
        await message.channel.send({files: [
            {
                attachment: message.author.displayAvatarURL,
                name: "avatar.png"
            }
        ]});
    } else {
        message.channel.send({files: [
            {
                attachment: target.user.displayAvatarURL,
                name: "avatar.png"
            }
        ]}); 
    }
    msg.delete();
}

module.exports.help = {
    name: "avatar"
}