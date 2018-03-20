const ytdl = module.require("ytdl-core")

module.exports.run = async (bot,message,args) => {
    let voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) return message.channel.send("You need to be in a voice channel to play music!");
    let permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT")) return message.channel.send("I cannot connect; missing connect permissions");
    if (!permissions.has("SPEAK")) return message.channel.send("I cannot speak; missing speak permissions");

    try {
        var connection = await voiceChannel.join();
    } catch (e) {
        console.log(e.stack);
        return message.channel.send(e);
    }

    let dispatcher = connection.playStream(ytdl(args[0]))
        .on ("end", () => {
            voiceChannel.leave();
        })
        .on ("error", error => {
            console.log(error);
        });
    
    dispatcher.setVolumeLogarithmic(5/5);
}

module.exports.help = {
    name: "play"
}