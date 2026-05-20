module.exports = {
    helpf: '(global | name)',
    desc: 'Returns true if you have a msgcollector() running in the current channel with the specified name (if specified). If global is specified, it checks if any collector is running.',
    func: async function (matches, msg) {
        let poopy = this
        let tempdata = poopy.tempdata
        let { splitKeyFunc } = poopy.functions

        var word = matches[1]
        var [global, name] = splitKeyFunc(word, { args: 2 })

        function getUserCollectors(messageCollectors = {}) {
            return (name && messageCollectors[name])
                ? [[name, messageCollectors[name]]]
                : Object.entries(messageCollectors)
        }

        return (
            global
                ? Object.values(tempdata[msg.guild.id][msg.channel.id]).some(u => getUserCollectors(u?.messageCollectors).length > 0)
                : getUserCollectors(tempdata[msg.guild.id][msg.channel.id][msg.author.id].messageCollectors).length > 0
        ) || ''
    }
}
