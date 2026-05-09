module.exports = {
  helpf: '()',
  desc: 'Sends a typing signal to the channel, stops after 10 seconds or when a message (by the bot) is sent.',
  func: async function (_, msg) {
    let poopy = this

    msg.channel.sendTyping().catch(() => { })
    return ''
  },
  attemptvalue: 2
}