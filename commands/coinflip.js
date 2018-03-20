module.exports.run = async (bot,message,args) => {
    let rand = Math.floor(Math.random()*2) + 1
    if (rand === 1) {
        message.channel.send("The coin landed on **heads!**")
    } else {
        message.channel.send("The coin landed on **tails!**")
    }
}

module.exports.help = {
    name: "coinflip"
}