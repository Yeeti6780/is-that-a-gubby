module.exports = {
    helpf: '(name | function<val(index)>)',
    desc: 'Globally declares a function with the name and function specified. Functions can be used by typing in [functionname].',
    func: async function (matches, msg, isBot, string, opts) {
        let poopy = this
        let { splitKeyFunc, getKeywordsFor, regexClean } = poopy.functions
        let tempdata = poopy.tempdata

        var word = matches[1]
        var fullword = `${matches[0]}(${matches[1]})`
        var split = splitKeyFunc(word, { args: 2 })
        var name = await getKeywordsFor(split[0] ?? '', msg, isBot).catch(() => { }) ?? ''
        name = regexClean(name)
        var value = split[1] ?? ''
        var phrase = string.replace(new RegExp(`${regexClean(fullword)}\\s*`, 'i'), '')
        tempdata[msg.guild.id][msg.channel.id].declared[`[${name}]`] = value
        tempdata[msg.guild.id][msg.channel.id].funcDeclared[`[${name}]`] = {
            func: async function (matches, msg, isBot, _, opts) {
                var word = matches[1]
                var split = splitKeyFunc(word)

                var valOpts = { ...opts }
                valOpts.extraFuncs = { ...valOpts.extraFuncs }

                valOpts.extraFuncs.val = {
                    func: async function (matches, msg, isBot, _, opts) {
                        var word = matches[1]
                        var index = Number(word.replace(/\+/g, '')) <= 0 ? 0 : Math.round(Number(word.replace(/\+/g, ''))) || 0

                        if (word.endsWith('+')) return await getKeywordsFor(split.slice(index).join(' ') || '', msg, isBot, opts).catch(() => { }) || ''
                        return await getKeywordsFor(split[index] || '', msg, isBot, opts).catch(() => { }) || ''
                    }
                }

                return await getKeywordsFor(value.replace(new RegExp(`\\[${name}\\]\\(([\\s\\S]*?)\\)`, 'ig'), tempdata[msg.guild.id][msg.channel.id].declared[`[${name}]`] || ''), msg, isBot, valOpts).catch(() => { }) ?? ''
            },
            raw: true,
            declared: true
        }
        return [phrase, true]
    },
    raw: true,
    parentheses: true,
    attemptvalue: 5
}