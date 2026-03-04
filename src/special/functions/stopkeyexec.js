module.exports = {
    helpf: '(phrase) (manage messages permission only)',
    desc: 'Stops any sort of keyword execution for the current channel. Returns the phrase if specified.',
    func: async function (matches, msg) {
        let poopy = this
        let tempdata = poopy.tempdata
        let { DiscordTypes } = poopy.modules

        if (!(
            msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageGuild) ||
            msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageMessages) ||
            msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) ||
            msg.author.id === msg.guild.ownerId || config.ownerids.find(id => id == msg.author.id) ||
            isBot || msg.author.id == bot.user.id
        )) return ''

        var word = matches[1]
        tempdata[msg.guild.id][msg.channel.id].returnValue = word

        return ''
    },
    attemptvalue: 10
}