module.exports = {
  desc: 'Returns a random wave from THE "TSUNAMI GAME", how WACKY! 🤪',
  func: function () {
    let poopy = this
    let json = poopy.json
    let { randomChoice } = poopy.functions

    return randomChoice(json.tsunamiJSON).Name
  },
  array: function () {
    let poopy = this
    let json = poopy.json

    return json.tsunamiJSON.map(t => t.Name)
  }
}
