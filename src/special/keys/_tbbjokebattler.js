module.exports = {
  desc: 'Returns a random TBB joke battler... Why?',
  func: function () {
    let poopy = this
    let json = poopy.json
    let { randomChoice } = poopy.functions

    return randomChoice(json.battlerJSON.battlers.concat(json.battlerJSON.enemies).filter(b => b.joke)).name
  },
  array: function () {
    let poopy = this
    let json = poopy.json

    return json.battlerJSON.battlers.concat(json.battlerJSON.enemies).filter(b => b.joke).map(b => b.name)
  }
}
