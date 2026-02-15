module.exports = {
    helpf: '(name | value)',
    desc: 'Globally declares a variable with the name and value specified. Global variables can be used by typing in [{variableName}].',
    func: async function (matches, msg, isBot, string, opts) {
        let poopy = this
        let { splitKeyFunc, getKeywordsFor, regexClean } = poopy.functions
        let tempdata = poopy.tempdata

        var word = matches[1]
        var fullword = `${matches[0]}(${matches[1]})`
        var split = splitKeyFunc(word, { args: 2 })
        var name = await getKeywordsFor(split[0] ?? '', msg, isBot, opts).catch(() => { }) ?? ''
        name = regexClean(name)
        var value = await getKeywordsFor(split[1] ?? '', msg, isBot, opts).catch(() => { }) ?? ''
        var phrase = string.replace(new RegExp(`${regexClean(fullword)}\\s*`, 'i'), '')
        tempdata[msg.guild.id][msg.channel.id].declared[`[{${name}}]`] = value.replace(new RegExp(`\\[\\{${name}\\}\\]`, 'ig'), tempdata[msg.guild.id][msg.channel.id].declared[`[{${name}}]`] || '')
        tempdata[msg.guild.id][msg.channel.id].keyDeclared[`[{${name}}]`] = {
            func: async function (msg)  {
                return value.replace(new RegExp(`\\[\\{${name}\\}\\]`, 'ig'), tempdata[msg.guild.id][msg.channel.id].declared[`[{${name}}]`] || '')
            },
            declared: true
        }
        return [phrase, true]
    },
    raw: true,
    attemptvalue: 5
}