module.exports.run = async (bot,message,args) => {
    if (!Number(args[0])) return message.channel.send("Provide a number");
    let rand = Math.floor(Math.random()*args[0]) + 1
    message.channel.send(`I've chosen **${rand}!**`)
}

module.exports.help = {
    name: "randnum"
}