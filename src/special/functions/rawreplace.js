module.exports = {
  helpf: '(phrase | replacement<_match> | regexp)',
  desc: "Replaces everything in the phrase that matches the RegExp with the new replacement, but keywords and functions don't execute automatically. This also supports use of matched words with _match.",
  func: async function (matches, msg, isBot, _, opts) {
    let poopy = this
    let { splitKeyFunc, parseKeywords, replaceAsync, parseRegExp } = poopy.functions

    var word = matches[1]
    var split = splitKeyFunc(word, { args: 3 })
    var phrase = await parseKeywords(split[0] ?? '', msg, isBot, opts).catch(() => { }) ?? ''
    var replacement = split[1] ?? ''
    var reg = await parseKeywords(split[2] ?? '', msg, isBot, opts).catch(() => { }) ?? ''
    var regexp = parseRegExp(reg, 'ig')

    return await replaceAsync(phrase, regexp, async (match) => {
      var valOpts = { ...opts }
      valOpts.extraKeys = { ...valOpts.extraKeys }

      valOpts.extraKeys._match = {
        func: async () => {
          return match
        }
      }

      var found = await parseKeywords(replacement, msg, isBot, valOpts).catch(() => { }) ?? ''

      return found
    }).catch(() => { }) ?? ''
  },
  raw: true,
  attemptvalue: 2,
  parentheses: true
}
