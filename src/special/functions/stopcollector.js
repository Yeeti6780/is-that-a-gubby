module.exports = {
    helpf: '(noFinishPhrase | name)',
    desc: 'Stops all (or with specified name) message collectors YOU created that are still active in the channel.',
    func: function (matches, msg) {
        let poopy = this
        let tempdata = poopy.tempdata
        let { splitKeyFunc } = poopy.functions

        var word = matches[1]
        var [noFinishPhrase, name] = splitKeyFunc(word, { args: 2 })

        function getCollectors(messageCollectors = {}) {
            return (name && messageCollectors[name])
                ? [[name, messageCollectors[name]]]
                : Object.entries(messageCollectors)
        }

        var msgCollectorData = tempdata[msg.guild.id][msg.channel.id][msg.author.id]?.messageCollectors
        var collectors = getCollectors(msgCollectorData)

        for (var [name, collector] of collectors) {
            if (!collector?.stop) continue
            collector.stop(!noFinishPhrase ? 'time' : 'user')
            delete msgCollectorData[name]
        }

        return ''
    }
}
