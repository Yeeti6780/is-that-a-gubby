module.exports = {
    helpf: '() (manage messages permission only)',
    desc: 'Resumes keyword execution for the current channel.',
    func: async function (_, msg) {
        let poopy = this
        let tempdata = poopy.tempdata
        let config = poopy.config
        let { DiscordTypes } = poopy.modules

        if (!(
            msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageGuild) ||
            msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageMessages) ||
            msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) ||
            msg.author.id === msg.guild.ownerId || config.ownerids.find(id => id == msg.author.id) ||
            isBot || msg.author.id == bot.user.id
        )) return ''

        delete tempdata[msg.guild.id][msg.channel.id].returnValue

        return ''
    },
    attemptvalue: 10
}