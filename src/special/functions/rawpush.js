module.exports = {
  helpf: '(arrayName | value)',
  desc: 'Pushes a new raw value to an array.',
  func: async function (matches, msg, isBot, _, opts) {
    let poopy = this
    let { splitKeyFunc, parseKeywords } = poopy.functions
    let tempdata = poopy.tempdata

    var word = matches[1]
    var split = splitKeyFunc(word, { args: 2 })
    var name = await parseKeywords(split[0] ?? '', msg, isBot, opts).catch(() => { }) ?? ''
    var value = split[1] ?? ''

    var array = tempdata[msg.author.id][msg.id].arrays[name]
    if (!array) return ''

    array.push(value)

    return ''
  },
  raw: true
}