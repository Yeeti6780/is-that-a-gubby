module.exports = {
  helpf: '(arrayName)',
  desc: "Creates a new global array with the specified name. If it already exists, it'll be cleared.",
  func: function (matches, msg) {
    let poopy = this
    let tempdata = poopy.tempdata

    var word = matches[1]
    tempdata[msg.guild.id][msg.channel.id].arrays[word] = []

    return ''
  }
}