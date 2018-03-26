module.exports.run = async (bot,message,args) => {
    const target = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]) || message.guild.member(message.author);
    if (!target.user.bot) return message.channel.send("Sorry, this command only works on bots!");
    message.delete();
    hook(message.channel,target.user.username,args.shift().join(" "), target.user.displayAvatarURL);
    return;
}

function hook(channel,title,message,avatar) {
    if (!message) return;
    channel.fetchWebhooks()
        .then(webhook => {
            let foundHook = webhook.find("name","DaDerpDuck's Webhook")
            
            if (!foundHook) {
                channel.createWebhook("DaDerpDuck's Webhook","https://ih1.redbubble.net/image.222712334.4772/flat,800x800,075,f.jpg")
                    .then(webhook => {
                        webhook.send(message, {
                            "username": title,
                            "avatarurl": avatar,
                        });
                    })
                        .catch(error => {
                            console.log(error);
                            return channel.send("Something went wrong.. :(");
                    });
            } else {
                channel.createWebhook("DaDerpDuck's Webhook","https://ih1.redbubble.net/image.222712334.4772/flat,800x800,075,f.jpg")
                    .then(webhook => {
                        webhook.send(message, {
                            "username": title,
                            "avatarurl": avatar,
                        });
                    })
                        .catch(error => {
                            console.log(error);
                            return channel.send("Something went wrong.. :(");
                    });
            }
        });
    return;
}

module.exports.help = {
    name: "pretend"
}
