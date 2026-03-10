module.exports = {
  desc: 'Returns the name of any TBB enemy, including joke and spoiler ones.',
  func: function () {
    let poopy = this
    let json = poopy.json
    let { randomChoice } = poopy.functions

    return randomChoice(json.battlerJSON.enemies).name
  },
  array: function () {
    let poopy = this
    let json = poopy.json

    return json.battlerJSON.enemies.map(b => b.name)
  }
}
