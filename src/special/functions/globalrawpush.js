module.exports = {
  helpf: '(arrayName | value)',
  desc: 'Pushes a new raw value to a global array.',
  func: async function (matches, msg, isBot, _, opts) {
    let poopy = this
    let { splitKeyFunc, parseKeywords } = poopy.functions
    let tempdata = poopy.tempdata

    var word = matches[1]
    var split = splitKeyFunc(word, { args: 2 })
    var name = await parseKeywords(split[0] ?? '', msg, isBot, opts).catch(() => { }) ?? ''
    var value = split[1] ?? ''

    var array = tempdata[msg.guild.id][msg.channel.id].arrays[name]
    if (!array) return ''

    array.push(value)

    return ''
  },
  raw: true
}