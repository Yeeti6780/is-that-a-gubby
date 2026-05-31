module.exports = {
    helpf: '(global | name)',
    desc: 'Returns true if you have a msgcollector() running in the current channel with the specified name (if specified). If global is specified, it checks if any collector is running.',
    func: async function (matches, msg) {
        let poopy = this
        let tempdata = poopy.tempdata
        let { splitKeyFunc } = poopy.functions

        var word = matches[1]
        var [global, name] = splitKeyFunc(word, { args: 2 })

        function getCollectors(collectors = {}) {
            return name
                ? (collectors[name] ? [[name, collectors[name]]] : [])
                : Object.entries(collectors)
        }

        return (
            global
                ? Object.values(tempdata[msg.guild.id][msg.channel.id]).some(u => getCollectors(u?.collectors).length > 0)
                : getCollectors(tempdata[msg.guild.id][msg.channel.id][msg.author.id].collectors).length > 0
        ) || ''
    }
}
