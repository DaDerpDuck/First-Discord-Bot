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
    for (let k in helplist) {
        let subcom = "";
        helplist[k].forEach((v,i) => {
            if (i < v.length-1) {
                subcom += `\`${helplist[k][i]}\`, `;
            } else {
                subcom += `\`${helplist[k][i]}\``;
            }
        });
        cmds.push(cmds, {
            name:`**${k}**`,
            value:subcom
        });
    }
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