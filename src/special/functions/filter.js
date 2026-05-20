module.exports = {
    helpf: '(arrayName | function<_val|_index>)',
    desc: 'Filters the values of the array that match the function.',
    func: async function (matches, msg, isBot, _, opts) {
        let poopy = this
        let { splitKeyFunc, parseKeywords, filterAsync, chunkArray } = poopy.functions
        let tempdata = poopy.tempdata

        var word = matches[1]
        var split = splitKeyFunc(word, { args: 2 })
        var name = await parseKeywords(split[0] ?? '', msg, isBot, opts).catch(() => { }) ?? ''
        var func = split[1] ?? ''

        var array = tempdata[msg.author.id][msg.id].arrays[name]
        if (!array) return ''

        var filtered = []
        var chunks = chunkArray(array, 50)
        for (var chunk of chunks) {
            var filter = await filterAsync(chunk, async (val) => {
                var valOpts = { ...opts }
                valOpts.extraKeys = { ...valOpts.extraKeys }

                valOpts.extraKeys._val = {
                    func: async () => {
                        return val
                    }
                }
                valOpts.extraKeys._index = {
                    func: async () => {
                        return index
                    }
                }

                var found = await parseKeywords(func, msg, isBot, valOpts).catch(() => { }) ?? ''

                return found
            }).catch(() => { }) ?? []

            filtered = filtered.concat(filter)
        }

        tempdata[msg.author.id][msg.id].arrays[name] = filtered

        return ''
    },
    attemptvalue: 5,
    raw: true
}
