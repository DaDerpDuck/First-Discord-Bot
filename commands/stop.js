module.exports.run = async (bot,message,args) => {
    if (!message.member.voiceChannel) return message.channel.send("You're not in a voice channel!");
    message.member.voiceChannel.leave();
}

module.exports.help = {
    name: "stop"
}