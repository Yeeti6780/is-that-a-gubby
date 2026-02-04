module.exports = {
  helpf: '(arrayName)',
  desc: 'Returns the length of the global array.',
  func: function (matches, msg) {
    let poopy = this
    let tempdata = poopy.tempdata

    var word = matches[1]
    return (tempdata[msg.guild.id][msg.channel.id].arrays[word] ?? []).length
  }
}