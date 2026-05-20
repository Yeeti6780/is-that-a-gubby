module.exports = {
  helpf: '(phrase1 | phrase2 | phrase3 | etc...)',
  desc: 'Returns the last phrase if none are blank.',
  func: async function (matches, msg, isBot, _, opts) {
    let poopy = this
    let { splitKeyFunc, parseKeywords } = poopy.functions

    var word = matches[1]
    var split = splitKeyFunc(word)
    var and = ''
    for (var i in split) {
      var phrase = (await parseKeywords(split[i], msg, isBot, opts).catch(() => { }) ?? '').trim();
      if (!phrase) return ''
      else and = phrase
    }
    return and
  },
  raw: true
}