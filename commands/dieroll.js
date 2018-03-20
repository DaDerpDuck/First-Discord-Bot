module.exports.run = async (bot,message,args) => {
    let rand = Math.floor(Math.random()*6) + 1
    message.channel.send(`The die landed on **${rand}!**`)
}

module.exports.help = {
    name: "dieroll"
}