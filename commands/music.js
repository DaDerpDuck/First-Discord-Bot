const ytdl = module.require("ytdl-core")
const queue = new Map();

module.exports.run = async (bot,message,args) => {
    const serverQueue = queue.get(message.guild.id);
    if (args[0] === "play") { //Play command
        //Checks permissions
        const voiceChannel = message.member.voiceChannel;
        if (!voiceChannel) return message.channel.send("You need to be in a voice channel to play music!");
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT")) return message.channel.send("I cannot connect; missing connect permissions");
        if (!permissions.has("SPEAK")) return message.channel.send("I cannot speak; missing speak permissions");
        
        //Generates information about song
        const songInfo = await ytdl.getInfo(args[1]);
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
                play(message.guild, queueConstruct.songs[0], message);
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
    } else if (args[0] === "stop") { //Stop command
        if (!message.member.voiceChannel) return message.channel.send("You're not in a voice channel!");
        if (!serverQueue) return message.channel.send("Nothing is playing...");
        message.channel.send("*Alright, I'll just wait until you say go...*");
        queue.delete(message.guild.id);
        serverQueue.connection.dispatcher.end();
        return;
    } else if (args[0] === "skip") { //Skip command
        if (!message.member.voiceChannel) return message.channel.send("You're not in a voice channel!");
        if (!serverQueue) return message.channel.send("Nothing is playing...");
        message.channel.send("*But I never got to fin-*");
        serverQueue.connection.dispatcher.end();
        return;
    }
}

function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    
    //If no more songs, leave channel
    if (!song) {
        serverQueue.textChannel.send("Queue has ended!")
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }
    
    //Plays song in queue, shifts it, plays again recursively
    const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
        .on ("end", () => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on ("error", error => console.log(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume/5);

    serverQueue.textChannel.send(`Playing: **${serverQueue.songs[0].title}**`)
}

module.exports.help = {
    name: "music"
}