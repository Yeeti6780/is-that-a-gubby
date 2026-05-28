module.exports = {
  helpf: '(phrase<break(phrase)> | times | separator)',
  desc: "Repeats the phrase by the times specified, but keywords and functions don't execute automatically. If the separator is specified, it'll separate each repetition with the separator.",
  func: async function (matches, msg, isBot, _, opts) {
    let poopy = this
    let { splitKeyFunc, parseKeywords, sleep } = poopy.functions
    let tempdata = poopy.tempdata
    let config = poopy.config

    var word = matches[1]
    var split = splitKeyFunc(word, { args: 3 })
    var phrase = split[0] ?? ''
    var times = Math.min(Number(await parseKeywords(split[1] ?? '', msg, isBot, opts).catch(() => { })), 100)
    var separator = await parseKeywords(split[2] ?? '', msg, isBot, opts).catch(() => { }) ?? ''

    var breakingBad = false

    var breakOpts = { ...opts }
    breakOpts.extraFuncs = { ...breakOpts.extraFuncs }
    breakOpts.extraFuncs.break = {
      func: async function (matches, msg) {
        var word = matches[1]
        tempdata[msg.author.id][msg.id].returnValue = word
        breakingBad = true
        return ''
      }
    }

    var repeat = []
    for (var i = 0; i < times; i++) {
      tempdata[msg.author.id][msg.id].keyAttempts++

      var repeatResult = await parseKeywords(phrase, msg, isBot, breakOpts).catch(() => { }) ?? ''
      if (!breakingBad) repeat.push(repeatResult)

      if (
        (!opts.ownermode && tempdata[msg.author.id][msg.id].keyAttempts >= config.keyLimit)
        || breakingBad
      ) break
      await sleep()
    }

    return repeat.join(separator)
  },
  raw: true,
  potential: { break: {} },
  limit: 5
}