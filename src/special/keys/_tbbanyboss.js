module.exports = {
  desc: 'Returns the name of any TBB boss, including joke, spoiler ones and other forms.',
  func: function () {
    let poopy = this
    let json = poopy.json
    let { randomChoice } = poopy.functions

    return randomChoice(json.battlerJSON.enemies.filter(b => b.boss)).name
  },
  array: function () {
    let poopy = this
    let json = poopy.json

    return json.battlerJSON.enemies.filter(b => b.boss).map(b => b.name)
  }
}
