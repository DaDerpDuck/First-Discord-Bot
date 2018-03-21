const ytdl = module.require("ytdl-core")
const queue = new Map();
const serverQueue = queue.get(message.guild.id)

module.exports.run = async (bot,message,args) => {
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) return message.channel.send("You need to be in a voice channel to play music!");
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT")) return message.channel.send("I cannot connect; missing connect permissions");
    if (!permissions.has("SPEAK")) return message.channel.send("I cannot speak; missing speak permissions");
    
    //Generates information about song
    const songInfo = await ytdl.getInfo(args[0]);
    const song = {
        title: songInfo.title,
        url: songInfo.video_url
    }
    
    if (!serverQueue) {
        //Creates array for queue
        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };
        //Creates a new map entry that can be referenced with the guild id
        queue.set(message.guild.id, queueConstruct);

        queueConstruct.songs.push(song);

        try {
            var connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            play(message.guild, queueConstruct.songs[0]);
        } catch (e) {
            console.log(e.stack);
            queue.delete(message.guild.id);
            return message.channel.send(e);
        }
    } else {
        serverQueue.songs.push(song);
        return message.channel.send(`**${song.title}** has been added to the queue!`);
    }
    return;
}

function play(guild,song) {
    const serverQueue = queue.get(guild.id);
    console.log(serverQueue.songs);

    //If no more songs, leave channel
    if (!song) {
        serverQueue.voiceChannel.leave();
        return queue.delete(guild.id);
    }

    //Plays song in queue, shifts it, plays again recursively
    const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
        .on ("end", () => {
            serverQueue.song.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on ("error", error => {
            console.log(error);
        });
    dispatcher.setVolumeLogarithmic(5/5);
}

module.exports.help = {
    name: "play"
}