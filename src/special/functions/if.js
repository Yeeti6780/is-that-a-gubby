module.exports = {
  helpf: '(condition | phrase | elsePhrase)',
  desc: 'Returns the phrase if the specified condition is not blank, or else it returns the elsePhrase, if it exists.',
  func: async function (matches, msg, isBot, _, opts) {
    let poopy = this
    let { splitKeyFunc, parseKeywords } = poopy.functions

    var word = matches[1]
    var split = splitKeyFunc(word, { args: 3 })
    var condition = await parseKeywords(split[0] ?? '', msg, isBot, opts).catch(() => { })
    var phrase = split[1] ?? ''
    var elsephrase = split[2] ?? ''
    return condition.trim() ? phrase : elsephrase
  },
  raw: true
}