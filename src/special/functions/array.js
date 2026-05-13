module.exports = {
  helpf: '(arrayName)',
  desc: "Creates a new array with the specified name. If it already exists, it'll be cleared.",
  func: function (matches, msg) {
    let poopy = this
    let tempdata = poopy.tempdata

    var word = matches[1]
    tempdata[msg.author.id][msg.id].arrays[word] = []

    return ''
  }
}