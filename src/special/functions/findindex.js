module.exports = {
    helpf: '(arrayName | function<_val>)',
    desc: 'Finds the key of the value in the array that matches the function.',
    func: async function (matches, msg, isBot, _, opts) {
        let poopy = this
        let { splitKeyFunc, parseKeywords, findIndexAsync, chunkArray } = poopy.functions
        let tempdata = poopy.tempdata

        var word = matches[1]
        var split = splitKeyFunc(word, { args: 2 })
        var name = await parseKeywords(split[0] ?? '', msg, isBot, opts).catch(() => { }) ?? ''
        var func = split[1] ?? ''

        var array = tempdata[msg.author.id][msg.id].arrays[name]
        if (!array) return ''

        var chunks = chunkArray(array, 50)
        var chunksRead = 0
        for (var chunk of chunks) {
            var find = await findIndexAsync(chunk, async (val) => {
                var valOpts = { ...opts }
                valOpts.extraKeys = { ...valOpts.extraKeys }
                
                valOpts.extraKeys._val = {
                    func: async () => {
                       return val
                    }
                }

                var found = await parseKeywords(func, msg, isBot, valOpts).catch(() => { }) ?? ''

                return found
            }).catch(() => { })

            if (find != -1) return find + chunksRead
            chunksRead += chunk.length
        }

        return -1
    },
    attemptvalue: 5,
    raw: true
}
