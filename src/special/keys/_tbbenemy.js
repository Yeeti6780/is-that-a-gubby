module.exports = {
  desc: 'Returns a random TBB enemy battler name.',
  func: function () {
    let poopy = this
    let json = poopy.json
    let { randomChoice } = poopy.functions

    return randomChoice(json.battlerJSON.enemies.filter(b => !b.joke && !b.spoiler && !b.origin)).name
  },
  array: function () {
    let poopy = this
    let json = poopy.json

    return json.battlerJSON.enemies.filter(b => !b.joke && !b.spoiler && !b.origin).map(b => b.name)
  }
}
