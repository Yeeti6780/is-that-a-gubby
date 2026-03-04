module.exports = {
    helpf: '(noFinishPhrase) (manage messages permission only)',
    desc: 'Stops all message collectors that are still active in the channel.',
    func: function (matches, msg, isBot) {
        let poopy = this
        let config = poopy.config
        let { DiscordTypes } = poopy.modules
        let tempdata = poopy.tempdata

        var word = matches[1]

        if (msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageGuild) || msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageMessages) || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) || msg.author.id === msg.guild.ownerId || config.ownerids.find(id => id == msg.author.id) || isBot) {
            for (var uid in tempdata[msg.guild.id][msg.channel.id]) {
                var userdata = tempdata[msg.guild.id][msg.channel.id][uid]
                if (userdata?.messageCollector?.stop) {
                    userdata.messageCollector.stop(!word ? 'time' : 'user')
                    delete tempdata[msg.guild.id][msg.channel.id][uid].messageCollector
                }
            }
        }

        return ''
    }
}
