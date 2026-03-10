module.exports = {
  desc: 'Returns the name of any TBB friendly, including joke and spoiler ones.',
  func: function () {
    let poopy = this
    let json = poopy.json
    let { randomChoice } = poopy.functions

    return randomChoice(json.battlerJSON.battlers).name
  },
  array: function () {
    let poopy = this
    let json = poopy.json

    return json.battlerJSON.battlers.map(b => b.name)
  }
}
