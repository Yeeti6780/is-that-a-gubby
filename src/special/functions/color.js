module.exports = {
  helpf: '(color)',
  desc: 'Converts the supplied color to RGB.',
  func: function (matches) {
    let poopy = this
    let json = poopy.json
    let { similarity } = poopy.functions

    var word = matches[1].trim()
    var colorJSON = json.colorJSON

    var color = colorJSON.reduce((closestColor, currentColor) =>
      similarity(currentColor.name ?? "", word)
        > similarity(closestColor.name ?? "", word)
        ? currentColor.hex : closestColor.hex
    ) ?? "#000000"

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color)
    return result ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}` : '0 0 0'
  }
}