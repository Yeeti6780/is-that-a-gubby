module.exports = {
  helpf: '(phrase | group | regexp)',
  desc: 'Matches the content in the phrase with the RegExp and returns the specified group.',
  func: function (matches) {
    let poopy = this
    let { splitKeyFunc, parseRegExp } = poopy.functions

    var word = matches[1]
    var split = splitKeyFunc(word, { args: 3 })
    var phrase = split[0] ?? ''
    var group = Number(split[1] ?? NaN)
    var reg = split[2] ?? ''
    var regexp = parseRegExp(reg, 'i')
    var match = phrase.match(regexp) ?? []
    return match[group] ?? match[match.length - 1] ?? ''
  },
  parentheses: true
}
