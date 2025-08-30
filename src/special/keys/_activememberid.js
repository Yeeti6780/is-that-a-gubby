module.exports = {
  desc: "Returns a random active member's ID from the server, this is calculated by the number of messages each one has sent and role order.",
  func: function (msg) {
    let poopy = this
    let data = poopy.data
    let { roundTo } = poopy.functions

    var datamembers = data.guildData[msg.guild.id].allMembers
    var roles = msg.guild.roles?.cache?.size || 1

    var activeMembers = Object.entries(datamembers).filter(([id, member]) => {
      if (!id) return false

      var hasRecentActivity = (Date.now() - (member.lastmessage || 0)) < 30 * 24 * 60 * 60 * 1000
      var hasMessages = (member.messages || 0) > 0
      return hasRecentActivity && hasMessages
    })

    if (activeMembers.length === 0) return ""

    var weightedMembers = activeMembers.map(([id, member]) => {
      var {
        messages = 0,
        highestroleorder = 0,
        lastmessage = 0,
        bot = false
      } = member

      var daysSinceLastActivity = (Date.now() - lastmessage) / (24 * 60 * 60 * 1000)
      var recencyPenalty = Math.pow(0.5, daysSinceLastActivity / 7)

      var messageWeight = Math.pow(roundTo(messages, 50) * highestroleorder / roles * 4, 1.5)

      var botMultiplier = bot ? 0.5 : 1

      var score = messageWeight * recencyPenalty * botMultiplier

      var weight = Math.max(score, 0.1)

      return { id, member, weight }
    }).sort((a, b) => b.weight - a.weight)

    var totalWeight = weightedMembers.reduce((sum, wm) => sum + wm.weight, 0)

    if (totalWeight === 0) {
      var randomIndex = Math.floor(Math.random() * weightedMembers.length)
      return weightedMembers[randomIndex].id
    }

    var random = Math.random() * totalWeight
    for (var wm of weightedMembers) {
      random -= wm.weight
      if (random <= 0) {
        return wm.id
      }
    }

    return weightedMembers[0].id
  },
  array: function (msg) {
    let poopy = this
    let data = poopy.data

    var datamembers = data.guildData[msg.guild.id].allMembers
    return Object.keys(datamembers)
  }
}