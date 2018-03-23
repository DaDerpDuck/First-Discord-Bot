const Discord = module.require("discord.js");
const object = new Object();
const helplist = {
    "Generic":["avatar","userinfo","ping","say","weather"],
    "Random":["coinflip","dieroll","diceroll","randnum"],
    "Moderation":["purge","striproles","mute","unmute","kick"],
    "Music":["music"]
}

module.exports.run = async (bot,message,args) => {
    let cmds = [];
    for (let [k,v] of object.entries(helplist)) {
        let subcom = "";
        v.forEach((v,i) => {
            if (i < v.length-1) {
                subcom += `\`${v[i]}\`, `;
            } else {
                subcom += `\`${v[i]}\``;
            }
        });
        cmds.push(cmds, {
            name:`**${k}**`,
            value:subcom
        });
    }
    let embed = new Discord.RichEmbed()
        .setAuthor("Available Commands")
        .setDescription(cmds)
        .setColor("#9B59B6");
    message.channel.send({embed: {
        title:"Available Commands",
        description:"Now THIS is de wey!",
        color:"#9B59B6",
        fields:cmds
    }});
}

module.exports.help = {
    name: "help"
}