module.exports = {
  helpf: '(arrayName | phrase | regexp)',
  desc: `Creates a new array by globally matching everything in the phrase by the RegExp. If it already exists, it'll be replaced.`,
  func: function (matches, msg) {
    let poopy = this
    let { splitKeyFunc, parseRegExp } = poopy.functions
    let tempdata = poopy.tempdata

    var word = matches[1]
    var split = splitKeyFunc(word, { args: 3 })
    var name = split[0] ?? ''
    var phr = split[1] ?? ''
    var reg = split[2] ?? ''
    var regexp = parseRegExp(reg, 'ig')
    tempdata[msg.author.id][msg.id].arrays[name] = phr.match(regexp)
    return ''
  },
  parentheses: true
}
