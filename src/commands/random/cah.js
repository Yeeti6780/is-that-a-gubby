module.exports = {
  name: ['cah', 'cardsagainsthumanity'],
  args: [{ "name": "picks", "required": false, "specifarg": false, "orig": "[pick1 | pick2 | pick3]" }],
  execute: async function (msg, args) {
    let poopy = this
    let json = poopy.json
    let { fetchPingPerms, randomChoice } = poopy.functions

    var cahJSON = json.cahJSON

    var split = args.slice(1).join(' ').split(/ ?\| ?/, 3)

    var black = randomChoice(cahJSON.black)
    var phrase = black.text

    var useWhite = !split.length || !split[0]

    if (useWhite) {
      split = Array.from({ length: 3 }).map(() => randomChoice(cahJSON.white))
    }

    if (split.length && split[0]) {
      if (phrase.match(/_/)) {
        var i = 0
        phrase = phrase.replace(/_(.?)/sg, (m) => {
          i++

          var white = split[(i - 1) % split.length]
          if (useWhite && m[1] && m[1] != "\n") white = white.replace(/[\.\?!]+$/, "")

          return m.replace(/_/, white)
        })
      } else {
        for (var i = 0; i < black.pick; i++) {
          phrase += `${i > 0 ? "\n" : " "}${split[i % split.length]}`
        }
      }
    }

    if (!msg.nosend) await msg.reply({
      content: phrase,
      allowedMentions: fetchPingPerms(msg)
    }).catch(() => { })

    return phrase
  },
  help: { name: 'cah/cardsagainsthumanity [pick1 | pick2 | pick3]', value: 'Sends a random Cards Against Humanity result. If specified, the blank spaces will be filled with the picks.' },
  cooldown: 2500,
  type: 'Text'
}