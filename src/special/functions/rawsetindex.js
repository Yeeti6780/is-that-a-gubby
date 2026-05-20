module.exports = {
    helpf: '(arrayName | index | value)',
    desc: "Sets the value in the array with that index to a new one, except keywords and functions don't execute automatically.",
    func: async function (matches, msg, isBot, _, opts) {
        let poopy = this
        let { splitKeyFunc, parseKeywords } = poopy.functions
        let tempdata = poopy.tempdata

        var word = matches[1]
        var split = splitKeyFunc(word, { args: 3 })
        var name = await parseKeywords(split[0] ?? '', msg, isBot, opts).catch(() => { }) ?? ''
        var index = await parseKeywords(split[1] ?? '0', msg, isBot, opts).catch(() => { }) ?? '0'
        var newVal = split[2] ?? ''

        var array = tempdata[msg.author.id][msg.id].arrays[name]
        if (!array) return ''

        array[index] = newVal

        return ''
    },
    raw: true
}