module.exports = {
  desc: 'doopley text',
  func: function () {
    let poopy = this
    let json = poopy.json
    let { randomChoice } = poopy.functions

    return randomChoice(json.doopleyJSON.textes)
  },
  array: function () {
    let poopy = this
    let json = poopy.json

    return json.doopleyJSON.textes
  },
  cmdconnected: 'doopley'
}
