module.exports = {
  desc: 'Returns a random TBB summon name. Honestly quite incredible.',
  func: function () {
    let poopy = this
    let json = poopy.json
    let { randomChoice } = poopy.functions

    return randomChoice(json.battlerJSON.battlers.concat(json.battlerJSON.enemies).filter(b => !b.joke && !b.spoiler && b.summon)).name
  },
  array: function () {
    let poopy = this
    let json = poopy.json

    return json.battlerJSON.battlers.concat(json.battlerJSON.enemies).filter(b => !b.joke && !b.spoiler && b.summon).map(b => b.name)
  }
}
