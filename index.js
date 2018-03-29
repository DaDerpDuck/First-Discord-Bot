const Discord = require("discord.js");
const botSettings = require("./botsettings.json");
const db = require("quick.db");
const fs = require("fs");
const bot = new Discord.Client({disableEveryone: true});
const prefix = botSettings.prefix;
bot.commands = new Discord.Collection();
bot.mutes = require("./mutes.json");

//Reads from each command file
fs.readdir("./commands/",(err,files) => {
    if (err) console.error(err);
    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if (jsfiles.length <= 0) {
        console.log("No commands to load");
        return;
    }
    console.log(`Loading ${jsfiles.length} commands...`);
    jsfiles.forEach((f,i) => {
        let props = require(`./commands/${f}`);
        console.log(`${i+1}: ${f} loaded!`);
        bot.commands.set(props.help.name,props);
    });
});

//Fires when bot is on
bot.on("ready", async() => {
    console.log(`Bot is ready! ${bot.user.username}`);
    bot.setInterval(() => {
        let mutes = [];
        const fetch = db.fetch("mutes").then(i => mutes.push(fetch[i])});
        //Unmutes when time is up
        for(let i in bot.mutes) {
            let time = bot.mutes[i].time;
            let guildId = bot.mutes[i].guild;
            let guild = bot.guilds.get(guildId);
            let member = guild.members.get(i);
            let role = bot.guilds.get(guildId);
            let mutedRole = guild.roles.find(r => r.name === "DDA Muted");
            if (!mutedRole) continue;

            if(Date.now() >= time) {
                member.removeRole(mutedRole);
                delete bot.mutes[i];
                fs.writeFile("./mutes.json", JSON.stringify(bot.mutes), err => {
                    if (err) throw err;
                });
            }
            
            
            /*
            {
                "user1_guild1":time,
                "user2_guild2":time
            }
            */
            
            //Test
            /*
            let newArray = [];

            time = mutes.map(function(e) {if (Date.now() >= e.time) return removeArray(e.user,e.guild)});

            function removeArray(userId,userGuild) {
              pos = mutes.map(function(e) {return [e.user,e.guild];}).reduce(function(a, e, i) {
                  if (e[0] === userId && e[1] === userGuild) {
                    a.push(i);
                    delete mutes[a];
                  }
                  return a;
              }, []);
            }
            for (var h = 0; h < mutes.length; h++) {
              if (mutes[h]) {
                newArray.push(mutes[h]);
              }
            }
            db.set("mutes",newArray);
            console.log(mutes);
            */
        }
    }, 5000);
    bot.user.setActivity("on a brick")
    try {
        let link = await bot.generateInvite(["ADMINISTRATOR"]);
        console.log(link);
    } catch(e) {
        console.log(e.stack);
    }
});

bot.on("disconnect", () => console.log("Bot disconnected"));
bot.on("reconnecting", () => console.log("Reconnecting..."))

//Fires when a message is sent
bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    let messageArray = message.content.split(/\s+/g);
    let command = messageArray[0];
    let args = messageArray.slice(1);
    if (!command.startsWith(prefix)) return;

    let cmd = bot.commands.get(command.slice(prefix.length));
    if (cmd) cmd.run(bot, message, args);
});

bot.login(process.env.token);
