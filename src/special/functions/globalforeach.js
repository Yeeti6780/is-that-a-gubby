module.exports = {
    helpf: '(arrayName | function<_index|_val>)',
    desc: "For each value in that global array, it'll execute the function.",
    func: async function (matches, msg, isBot, _, opts) {
        let poopy = this
        let { splitKeyFunc, parseKeywords, sleep } = poopy.functions
        let tempdata = poopy.tempdata
        let config = poopy.config

        var word = matches[1]
        var split = splitKeyFunc(word, { args: 2 })
        var name = await parseKeywords(split[0] ?? '', msg, isBot).catch(() => { }) ?? ''
        var func = split[1] ?? ''

        var array = tempdata[msg.guild.id][msg.channel.id].arrays[name]
        if (!array) return ''

        var breakingBad = false

        for (var index in array) {
            var val = array[index]
            var valOpts = { ...opts }
            valOpts.extraKeys = { ...valOpts.extraKeys }
            valOpts.extraFuncs = { ...valOpts.extraFuncs }

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
            valOpts.extraFuncs.break = {
                func: async function (matches, msg) {
                    var word = matches[1]
                    tempdata[msg.author.id][msg.id].returnValue = word
                    breakingBad = true
                    return ''
                }
            }

            await parseKeywords(func, msg, isBot, valOpts).catch(() => { })

            if (
                (!opts.ownermode && tempdata[msg.author.id][msg.id].keyAttempts >= config.keyLimit)
                || breakingBad
            ) break
            await sleep()
        }

        return ''
    },
    attemptvalue: 5,
    potential: {
        keys: { _val: {}, _index: {}, break: {} }
    },
    raw: true
}