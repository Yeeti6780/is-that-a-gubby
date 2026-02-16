module.exports = {
    helpf: '(arrayName | val)',
    desc: 'Returns the value if the global array includes it.',
    func: async function (matches, msg, isBot, _, opts) {
        let poopy = this
        let { splitKeyFunc, getKeywordsFor } = poopy.functions
        let tempdata = poopy.tempdata

        var word = matches[1]
        var split = splitKeyFunc(word, { args: 2 })
        var name = await getKeywordsFor(split[0] ?? '', msg, isBot, opts).catch(() => { }) ?? ''
        var val = split[1] ?? ''

        var array = tempdata[msg.guild.id][msg.channel.id].arrays[name]
        if (!array) return ''

        return array.includes(val) ? val : ''
    }
}
