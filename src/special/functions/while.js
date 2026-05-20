module.exports = {
  helpf: '(condition | function)',
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

    while ((await parseKeywords(condition, msg, isBot, opts).catch(() => { }) ?? '').trim()) {
      tempdata[msg.author.id][msg.id].keyAttempts++
      await parseKeywords(func, msg, isBot, opts).catch(() => { })
      await sleep()
      if (!opts.ownermode && tempdata[msg.author.id][msg.id].keyAttempts >= config.keyLimit) break
    }

    return ''
  },
  raw: true,
  limit: 5
}