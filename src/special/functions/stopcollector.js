module.exports = {
    helpf: '(noFinishPhrase | name)',
    desc: 'Stops all (or with specified name) message collectors YOU created that are still active in the channel.',
    func: function (matches, msg) {
        let poopy = this
        let tempdata = poopy.tempdata
        let { splitKeyFunc } = poopy.functions

        var word = matches[1]
        var [noFinishPhrase, name] = splitKeyFunc(word, { args: 2 })

        function getCollectors(collectors = {}) {
            return (name && collectors[name])
                ? [[name, collectors[name]]]
                : Object.entries(collectors)
        }

        var collectorData = tempdata[msg.guild.id][msg.channel.id][msg.author.id]?.collectors
        var collectors = getCollectors(collectorData)

        for (var [name, collector] of collectors) {
            if (!collector?.stop) continue
            collector.stop(!noFinishPhrase ? 'time' : 'user')
            delete collectorData[name]
        }

        return ''
    }
}
