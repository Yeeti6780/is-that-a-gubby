module.exports = {
  desc: 'doopley image',
  func: function () {
    let poopy = this
    let json = poopy.json
    let { randomChoice } = poopy.functions

    return randomChoice(json.doopleyJSON.images)
  },
  array: function () {
    let poopy = this
    let json = poopy.json

    return json.doopleyJSON.images
  },
  cmdconnected: 'doopley'
}
