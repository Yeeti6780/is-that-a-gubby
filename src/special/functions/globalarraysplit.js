module.exports = {
  helpf: '(arrayName | separator | phrase)',
  desc: `Creates a new global array by splitting the phrase by the separator. If it already exists, it'll be replaced.`,
  func: function (matches, msg) {
    let poopy = this
    let { splitKeyFunc } = poopy.functions
    let tempdata = poopy.tempdata

    var word = matches[1]
    var split = splitKeyFunc(word, { args: 3 })
    var name = split[0] ?? ''
    var separator = split[1] ?? '|'
    var phr = split[2] ?? ''
    tempdata[msg.guild.id][msg.channel.id].arrays[name] = splitKeyFunc(phr, { separator: separator })
    return ''
  }
}