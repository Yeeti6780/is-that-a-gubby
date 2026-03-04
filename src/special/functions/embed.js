module.exports = {
    helpf: '(json) (manage messages only)',
    desc: 'Send an embed from JSON to the channel, returns its ID afterwards.',
    func: async function (matches, msg, isBot, _, opts) {
        let poopy = this
        let tempdata = poopy.tempdata
        let { tryJSONparse } = poopy.functions
        let { DiscordTypes } = poopy.modules
        let globaldata = poopy.globaldata
        let data = poopy.data
        let config = poopy.config

        var word = matches[1]

        var guildfilter = config.guildfilter
        var channelfilter = config.channelfilter
        
        var bypassPerms = (
            msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageGuild) ||
            msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageMessages) ||
            msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) ||
            msg.author.id === msg.guild.ownerId ||
            (config.ownerids.find(id => id == msg.author.id)) ||
            isBot
        )

        var isFiltered = (guildfilter.blacklist && guildfilter.ids.includes(msg.guild.id)) ||
            (
                !(guildfilter.blacklist) &&
                !(guildfilter.ids.includes(msg.guild.id))
            ) ||
            (
                channelfilter.gids.includes(msg.guild.id) &&
                (
                    (channelfilter.blacklist && channelfilter.ids.some(
                        id => id == msg.channel?.id || id == msg.channel?.parent?.id || id == msg.channel?.parent?.parent?.id
                    )) ||
                    (!(channelfilter.blacklist) && !(channelfilter.ids.some(
                        id => id == msg.channel?.id || id == msg.channel?.parent?.id || id == msg.channel?.parent?.parent?.id
                    )))
                )
            )

        var isRestricted = data.guildData[msg.guild.id].restricted.some(
            id => id == msg.channel?.id || id == msg.channel?.parent?.id || id == msg.channel?.parent?.parent?.id
        ) && !bypassPerms

        if (isFiltered || isRestricted || tempdata[msg.guild.id][msg.channel.id].shutUp) return ''

        if (globaldata.shit.find(id => id === msg.author.id)) return 'shit'

        if (data.guildData[msg.guild.id].members[msg.author.id].coolDown) {
            if ((data.guildData[msg.guild.id].members[msg.author.id].coolDown - Date.now()) > 0 &&
                tempdata[msg.author.id].coolDownMsg !== msg.id) {
                return `Calm down! Wait more ${(data.guildData[msg.guild.id].members[msg.author.id].coolDown - Date.now()) / 1000} seconds.`
            } else {
                data.guildData[msg.guild.id].members[msg.author.id].coolDown = false
            }
        }

        tempdata[msg.author.id].coolDownMsg = msg.id
        
        if (
            !opts.ownermode &&
            tempdata[msg.author.id][msg.id].execCount >= 1 &&
            !data.guildData[msg.guild.id].chaincommands &&
            !bypassPerms
        ) return 'You can\'t chain commands in this server.'

        if (
            !opts.ownermode &&
            tempdata[msg.author.id][msg.id].execCount >= config.commandLimit * (bypassPerms ? 5 : 1)
        ) return `Number of commands to run at the same time must be smaller or equal to **${config.commandLimit * (bypassPerms ? 5 : 1)}**!`

        tempdata[msg.author.id][msg.id].execCount++
        
        data.guildData[msg.guild.id].members[msg.author.id].coolDown = (data.guildData[msg.guild.id].members[msg.author.id].coolDown || Date.now()) + 2500 / ((msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageGuild) || msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageMessages) || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) || msg.author.id === msg.guild.ownerId) ? 5 : 1)

        if (msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageGuild) || msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageMessages) || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) || msg.author.id === msg.guild.ownerId || config.ownerids.find(id => id == msg.author.id) || isBot) {
            var embed = tryJSONparse(word)
            if (!embed) return 'Malformatted embed JSON.'
            
            var m = await msg.reply({
                embeds: [embed]
            }).catch(() => { })
            if (!m) return 'Error.'

            return m.id
        } else {
            return 'You need to have the manage messages permission to execute that!'
        }
    },
    attemptvalue: 10
}
