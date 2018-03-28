const db = module.require("quick.db");
const fs = module.require("fs");
const timeTable = {
    "s": [1000,"seconds"],
    "m": [60000,"minutes"],
    "h": [3600000,"hours"],
    "d": [86400000,"days"],
    "y": [31536000000,"years"]
}

module.exports.run = async (bot,message,args) => {
    //Check if executer has right permissions
    if (!message.member.hasPermission("MANAGE_ROLES")) return message.channel.send("Incorrect permissions (You need the manage roles permissions)");
    //Get mentioned user, return if none
    let mutee = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    if (!mutee) return message.channel.send("You must specify an available user!");
    //Check if mutee has higher roles
    if (mutee.id === message.author.id) return message.channel.send("You cannot mute yourself");
    if (mutee.user.bot) return message.channel.send("You cannot mute a bot");
    if (mutee.highestRole.position >= message.member.highestRole.position) return message.channel.send("You cannot mute someone with a higher/same role as you");

    //Does the actual muting
    let role = message.guild.roles.find(r => r.name === "DDA Muted")
    if (!role) {
        //Create new role wih no permissions and create channel overrides for that role
        try{
            let role = await message.guild.createRole({
                name: "DDA Muted",
                color: "#000000",
                permissions: []
            });
            message.guild.channels.forEach(async (channel,id) => {
                await channel.overwritePermissions(role, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false,
                    SPEAK: false
                });
            });
        } catch(e) {
            console.log(e.stack);
        } 
    }
    if (mutee.roles.has(role.id)) return message.channel.send(`${mutee.user.username} is already muted`)

    //Allows to specify time
    await mutee.addRole(role);
    if (args[1]) {
        let timeAmount = args[1].substring(args[1].length-1,args[1].length);
        let time = args[1].substring(0,args[1].length-1);
        if (!Number(time)) return message.channel.send(`${mutee.user.username} has been muted`);
        bot.mutes[mutee.id] = {
            guild: message.guild.id,
            time: Date.now() + parseInt(args[1]) * timeTable[timeAmount][0]
        }
        
        // const db = require("quick.db");

        // db.set("guild_1",{"mutes":[]});

        // db.push("guild_1",{"userId":1,"time":5},{target:".mutes"}).then(i => {
        //     console.log(i.mutes)
        // });

        // db.push("guild_1",{"userId":2,"time":55},{target:".mutes"}).then(i => {
        //     console.log(i.mutes)
        // });

        //Writes to json file with when mutee can be unmuted
        fs.writeFile("./mutes.json", JSON.stringify(bot.mutes, null, 4), err =>{
            if (err) throw err;
            message.channel.send(`${mutee.user.username} has been muted for ${time} ${timeTable[timeAmount][1]}`)
        });
    } else {
        message.channel.send(`${mutee.user.username} has been muted`)
    }
    return;
}

module.exports.help = {
    name: "mute"
}
