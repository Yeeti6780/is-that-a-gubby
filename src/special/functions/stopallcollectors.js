module.exports = {
    helpf: '(noFinishPhrase | name) (manage messages permission only)',
    desc: 'Stops all (or with specified name) message collectors that are still active in the channel.',
    func: function (matches, msg, isBot) {
        let poopy = this
        let config = poopy.config
        let { DiscordTypes } = poopy.modules
        let tempdata = poopy.tempdata

        var word = matches[1]
        var [noFinishPhrase, name] = splitKeyFunc(word, { args: 2 })

        function getCollectors(messageCollectors = {}) {
            return (name && messageCollectors[name])
                ? [[name, messageCollectors[name]]]
                : Object.entries(messageCollectors)
        }

        if (
            msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageGuild) ||
            msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageMessages) ||
            msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) ||
            msg.author.id === msg.guild.ownerId ||
            config.ownerids.find(id => id == msg.author.id) ||
            isBot
        ) {
            for (var uid in tempdata[msg.guild.id][msg.channel.id]) {
                var msgCollectorData = tempdata[msg.guild.id][msg.channel.id][uid]?.messageCollectors
                var collectors = getCollectors(msgCollectorData)
            
                for (var [name, collector] of collectors) {
                  if (!collector?.stop) continue
                  collector.stop(!noFinishPhrase ? 'time' : 'user')
                  delete msgCollectorData[name]
                }
            }
        }

        return ''
    }
}
