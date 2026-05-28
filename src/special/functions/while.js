module.exports = {
  helpf: '(condition | function<break(phrase)>)',
  desc: "Repeats the function while the condition is met.",
  func: async function (matches, msg, isBot, _, opts) {
    let poopy = this
    let { splitKeyFunc, parseKeywords, sleep } = poopy.functions
    let tempdata = poopy.tempdata
    let config = poopy.config

    var word = matches[1]
    var split = splitKeyFunc(word, { args: 2 })
    var condition = split[0] ?? ''
    var func = split[1] ?? ''

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

    while ((await parseKeywords(condition, msg, isBot, opts).catch(() => { }) ?? '').trim()) {
      tempdata[msg.author.id][msg.id].keyAttempts++
      await parseKeywords(func, msg, isBot, breakOpts).catch(() => { })

      if (
        (!opts.ownermode && tempdata[msg.author.id][msg.id].keyAttempts >= config.keyLimit)
        || breakingBad
      ) break
      await sleep()
    }

    return ''
  },
  raw: true,
  potential: { break: {} },
  limit: 20
}