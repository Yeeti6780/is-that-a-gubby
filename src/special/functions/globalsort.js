module.exports = {
  helpf: '(arrayName)',
  desc: 'Sorts the global array alphabetically.',
  func: function (matches, msg) {
    let poopy = this
    let tempdata = poopy.tempdata

    var word = matches[1]

    var array = tempdata[msg.guild.id][msg.channel.id].arrays[word]
    if (!array) return ''

    array.sort((a, b) => {
        if (a.toLowerCase() < b.toLowerCase()) return -1
        if (a.toLowerCase() > b.toLowerCase()) return 1
        return 0
    })

    return ''
  }
}