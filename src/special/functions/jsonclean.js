module.exports = {
  helpf: '(phrase)',
  desc: 'Cleans the content in the phrase so it can be used in JSON bodies without having quotes be escaped or anything alike.',
  func: function (matches) {
    let poopy = this
    let { jsonClean } = poopy.functions

    var word = matches[1]
    return jsonClean(word)
  }
}