const Discord = module.require("discord.js")
const weather = module.require("weather-js")

module.exports.run = async (bot,message,args) => {
    let find = args.join(" ")
    if (!args[0]) find = "Westminster, CA"

    weather.find({search: find, degreeType: "F"}, function(err,result) {
        if (err) message.channel.send(err);
        if (!result[0]) return message.channel.send("Something went wrong; try again")

        let current = result[0].current;
        let location = result[0].location;
        let embed = new Discord.RichEmbed()
            .setAuthor(`Weather for ${current.observationpoint}`)
            .setDescription(`**${current.skytext}**`)
            .setThumbnail(current.imageUrl)
            .setColor("#9B59B6")
            .addField("Timezone", `UTC ${location.timezone}`, true)
            .addField("Degree Type", location.degreetype, true)
            .addField("Temperature", `${current.temperature} degrees`, true)
            .addField("Feels Like", `${current.feelslike} degrees`, true)
            .addField("Winds", current.winddisplay, true)
            .addField("Humidity", `${current.humidity}%`, true)
            .addField("Time", current.observationtime, true)
            .addField("Date", `${current.day}, ${current.date}`, true);

        message.channel.send({embed: embed});
    });
}

module.exports.help = {
    name: "weather"
}
