const Discord = module.require("discord.js");
const YouTube = module.require("simple-youtube-api");
const ytdl = module.require("ytdl-core");
const queue = new Map();

const youtube = new YouTube(process.env.googleapikey)

module.exports.run = async (bot,message,args) => {
    const serverQueue = queue.get(message.guild.id);
    //Play
    if (args[0] === "play") {
        //Checks permissions
        if (!args[1]) return message.channel.send("Enter the music link!")
        const voiceChannel = message.member.voiceChannel;
        if (!voiceChannel) return message.channel.send("You need to be in a voice channel to play music!");
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT")) return message.channel.send("I cannot connect; missing connect permissions");
        if (!permissions.has("SPEAK")) return message.channel.send("I cannot speak; missing speak permissions");

        const searchString = args.slice(1).join(" ");
        const url = args[1].replace(/<(.+)>/g, "$1");
        
        //Generates information about song
        try {
            var video = await youtube.getVideo(url);
        } catch (error) {
            try {
                var videos = await youtube.searchVideos(searchString, 1);
                var video = await youtube.getVideoByID(videos[0].id);
            } catch (err) {
                return message.channel.send("Couldn't find any videos by that name!");
            }
        }

        const song = {
            id: video.id,
            title: video.title,
            url: `https://www.youtube.com/watch?v=${video.id}`
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
    //Stop
    } else if (args[0] === "stop") {
        if (!message.member.voiceChannel) return message.channel.send("You're not in a voice channel!");
        if (!serverQueue) return message.channel.send("Nothing is playing...");
        message.channel.send("*Alright, I'll just wait until you say go...*");
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
        return;
    //Pause
    } else if (args[0] === "pause") {
        if (!message.member.voiceChannel) return message.channel.send("You're not in a voice channel!");
        if (serverQueue && serverQueue.playing) {
            message.channel.send("*Alright, I'll just wait until you say go!*");
            serverQueue.playing = false;
            serverQueue.connection.dispatcher.pause();
            return message.channel.send("Song has been paused");
        }
        return message.channel.send("Nothing is playing")
    //Unpause
    } else if (args[0] === "unpause") {
        if (!message.member.voiceChannel) return message.channel.send("You're not in a voice channel!");
        if (serverQueue && !serverQueue.playing) {
            message.channel.send("*Freedom!*");
            serverQueue.playing = true;
            serverQueue.connection.dispatcher.return();
            return message.channel.send("Song has been unpaused");
        }
        return message.channel.send("Nothing is playing")
    //Skip
    } else if (args[0] === "skip") {
        if (!message.member.voiceChannel) return message.channel.send("You're not in a voice channel!");
        if (!serverQueue) return message.channel.send("Nothing is playing...");
        message.channel.send("*But I never got to fin-*");
        serverQueue.connection.dispatcher.end();
        return;
    //Volume
    } else if (args[0] === "volume") {
        if (!message.member.voiceChannel) return message.channel.send("You're not in a voice channel!");
        if (!serverQueue) return message.channel.send("Nothing is playing...");
        if (!args[1]) return message.channel.send(`Volume is at: **${serverQueue.volume}**`);
        if (!Number(args[1])) return message.channel.send("Please enter a valid number");
        serverQueue.volume = args[1];
        serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1]/5);
        return message.channel.send(`Set the volume to **${args[1]}**`);
    } else if (args[0] === "queue") {
        if (!serverQueue) return message.channel.send("Nothing is playing...");
        return message.channel.send(`
            __**Song queue:**__\n
            ${serverQueue.songs.map(song => `**-** ${song.title}`).join("\n")}
            **Playing:** ${serverQueue.songs[0].title}
        `);
    //Info
    } else if (args[0] === "info") {
        if (!serverQueue) return message.channel.send("Nothing is playing...");
        return message.channel.send(`Playing: **${serverQueue.songs[0].title}**`);
    //Help
    } else {
        const embed = new Discord.RichEmbed()
            .setAuthor("Music Help")
            .setDescription("play, skip, stop, pause, unpause, volume, queue, info")
            .setColor("9B59B6");
        message.channel.send({embed: embed});
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
