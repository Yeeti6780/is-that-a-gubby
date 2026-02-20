module.exports = {
    helpf: '(global)',
    desc: 'Returns true if you have a msgcollector() running in the current channel. If global is specified, it checks if any collector is running.',
    func: async function (matches, msg) {
        let poopy = this
        let tempdata = poopy.tempdata

        var word = matches[1]

        return (word
            ? Object.values(tempdata[msg.guild.id][msg.channel.id]).some(u => u.messageCollector)
            : !!tempdata[msg.guild.id][msg.channel.id][msg.author.id].messageCollector) || ''
    }
}
