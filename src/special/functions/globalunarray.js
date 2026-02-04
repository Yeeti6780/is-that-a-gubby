module.exports = {
    helpf: '(name)',
    desc: "Globally undeclares an array in case it exists.",
    func: async function (matches, msg) {
        let poopy = this
        let tempdata = poopy.tempdata

        var word = matches[1]

        delete tempdata[msg.guild.id][msg.channel.id].arrays[word]
        
        return ""
    }
}