const Kahoot = module.require("kahoot.js");
const randomName = module.require("nodejs-randomnames").getRandomName();
const client = new Kahoot;

module.exports.run = async (bot,message,args) => {
    if (!Number(args[1])) return message.channel.send("Input the id");
    try {
        client.join(args[1], randomName);
        return;
    } catch (e) {
        return message.channel.send("Something went wrong...");
    }
}

module.exports.help = {
    name: "kahoot"
}