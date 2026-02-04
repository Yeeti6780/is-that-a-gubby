module.exports = {
  helpf: '(arrayName)',
  desc: 'Reverses the global array with that name.',
  func: function (matches, msg) {
    let poopy = this
    let tempdata = poopy.tempdata

    var word = matches[1]

    var array = tempdata[msg.guild.id][msg.channel.id].arrays[word]
    if (!array) return ''

    tempdata[msg.guild.id][msg.channel.id].arrays[word] = array.reverse()

    return ''
  }
}