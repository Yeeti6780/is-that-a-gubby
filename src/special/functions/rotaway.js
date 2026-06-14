module.exports = {
  helpf: '(phrase | strength)',
  desc: "THE WORLD IS EN㢀DI㦑NG THE WORLD IS ENDING THE WOኧRLD IS EℎNDING",
  func: function (matches, msg, _, _, opts) {
    let poopy = this
    let { splitKeyFunc, rotAway } = poopy.functions
    let tempdata = poopy.tempdata
    let config = poopy.config

    var word = matches[1]
    var split = splitKeyFunc(word, { args: 2 })
    var phrase = split[0] ?? ''
    var strength = Math.max(Math.min(Number(split[1] ?? ''), 1), 0)
    return rotAway(phrase, {
      rottingTime: true, 
      rottingChance: strength
    })
  }
}
