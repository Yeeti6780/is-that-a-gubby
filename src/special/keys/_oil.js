module.exports = {
  desc: 'oil',
  func: function () {
    let poopy = this
    let arrays = poopy.arrays

    return arrays.shitting[Math.floor(Math.random() * arrays.shitting.length)]
  },
  array: function () {
    let poopy = this
    let arrays = poopy.arrays

    return arrays.shitting
  }
}
