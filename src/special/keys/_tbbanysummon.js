module.exports = {
  desc: 'Returns the name of any TBB summon, including joke and spoiler ones. Absolutely phenomenal.',
  func: function () {
    let poopy = this
    let json = poopy.json
    let { randomChoice } = poopy.functions

    return randomChoice(json.battlerJSON.battlers.concat(json.battlerJSON.enemies).filter(b => b.summon)).name
  },
  array: function () {
    let poopy = this
    let json = poopy.json

    return json.battlerJSON.battlers.concat(json.battlerJSON.enemies).filter(b => b.summon).map(b => b.name)
  }
}
