module.exports = {
  helpf: '(arrayName | promise1 | promise2 | etc...)',
  desc: `Creates a new global array from the values returned by each promise being executed inside of the function at the same time. If it already exists, it'll be replaced.`,
  func: function (matches, msg, isBot, string, opts) {
    let poopy = this
    let { splitKeyFunc, regexClean, parseRegExp, getKeywordsFor } = poopy.functions
    let tempdata = poopy.tempdata

    var word = matches[1]
    var split = splitKeyFunc(word)
    var name = await getKeywordsFor(split.splice(0, 1)[0] ?? '', msg, isBot, opts).catch(() => { }) ?? ''
    
    var fullword = `${matches[0]}(${matches[1]})`
    var phrase = string.replace(new RegExp(`${regexClean(fullword)}\\s*`, 'i'), '')
    tempdata[msg.guild.id][msg.channel.id].arrays[name] = await Promise.all(
        split.map(
            promise => getKeywordsFor(promise, msg, isBot, opts).catch(() => '')
        )
    ).catch(() => [])
    return [phrase, true]
  },
  attemptvalue: 5,
  raw: true
}
