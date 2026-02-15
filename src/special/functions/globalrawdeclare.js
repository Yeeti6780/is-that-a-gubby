module.exports = {
    helpf: '(name | value)',
    desc: "Globally declares a variable with the name and value specified, but keywords and functions don't execute automatically. Global variables can be used by typing in [{variablename}].",
    func: async function (matches, msg, isBot, string, opts) {
        let poopy = this
        let { splitKeyFunc, getKeywordsFor, regexClean } = poopy.functions
        let tempdata = poopy.tempdata

        var word = matches[1]
        var fullword = `${matches[0]}(${matches[1]})`
        var split = splitKeyFunc(word, { args: 2 })
        var name = await getKeywordsFor(split[0] ?? '', msg, isBot, opts).catch(() => { }) ?? ''
        name = regexClean(name)
        var value = split[1] ?? ''
        var phrase = string.replace(new RegExp(`${regexClean(fullword)}\\s*`, 'i'), '')
        tempdata[msg.guild.id][msg.channel.id].declared[`[{${name}}]`] = value.replace(new RegExp(`\\[\\{${name}\\}\\]`, 'ig'), tempdata[msg.guild.id][msg.channel.id].declared[`[{${name}}]`] || '')
        tempdata[msg.guild.id][msg.channel.id].keyDeclared[`[{${name}}]`] = {
            func: async function (msg, isBot, _, opts) {
                return await getKeywordsFor(value.replace(new RegExp(`\\[\\{${name}\\}\\]`, 'ig'), tempdata[msg.guild.id][msg.channel.id].declared[`[{${name}}]`] || ''), msg, isBot, opts).catch(() => { }) ?? ''
            },
            declared: true
        }
        return [phrase, true]
    },
    raw: true,
    attemptvalue: 10
}