module.exports.run = async (bot,message,args) => {
    let rand1 = Math.floor(Math.random()*6) + 1
    let rand2 = Math.floor(Math.random()*6) + 1
    message.channel.send(`The dice landed on **${rand1+rand2}!**`)
}

module.exports.help = {
    name: "diceroll"
}