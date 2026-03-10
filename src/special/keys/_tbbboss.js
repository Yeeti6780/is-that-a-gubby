module.exports = {
  desc: 'Returns a random TBB boss name.',
  func: function () {
    let poopy = this
    let json = poopy.json
    let { randomChoice } = poopy.functions

    return randomChoice(json.battlerJSON.enemies.filter(b => !b.joke && !b.spoiler && !b.origin && b.boss)).name
  },
  array: function () {
    let poopy = this
    let json = poopy.json

    return json.battlerJSON.enemies.filter(b => !b.joke && !b.spoiler && !b.origin && b.boss).map(b => b.name)
  }
}
