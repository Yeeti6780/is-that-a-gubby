module.exports = {
  name: ['fetchurls', 'geturls'],
  args: [{name: "message",required: true,specifarg: false,orig: "<message>"}],
  execute: async function (msg, args) {
    let poopy = this
    let { Discord } = poopy.modules
    let { getUrls, fetchPingPerms } = poopy.functions

    var urls = await getUrls(msg).catch(() => { }) ?? []
    if (!msg.nosend) await msg.reply({
      allowedMentions: fetchPingPerms(msg),
      content: urls.join('\n') || 'No URLs fetched.'
    }).catch(() => { })
    return urls.join('\n') || 'No URLs fetched.'
  },
  help: {
    name: 'fetchurls/geturls <message>',
    value: 'Fetches the file URLs in the message and returns them.'
  },
  cooldown: 2500,
  type: 'Fetching'
}