module.exports = {
    helpf: '(phrase)',
    desc: 'Sends a message to the channel. After being sent, it returns its ID. Has the default cooldown of course.',
    func: async function (matches, msg, isBot, _, opts) {
        let poopy = this
        let { DiscordTypes } = poopy.modules
        let { fetchPingPerms } = poopy.functions
        let tempdata = poopy.tempdata
        let globaldata = poopy.globaldata
        let data = poopy.data
        let config = poopy.config

        var word = matches[1]

        var guildfilter = config.guildfilter
        var channelfilter = config.channelfilter

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
        ) && !(
            msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.ManageGuild) ||
            msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.ManageMessages) ||
            msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) ||
            msg.author.id === msg.guild.ownerId ||
            (config.ownerids.find(id => id == msg.author.id)) ||
            isBot
        )

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

        if (!opts.ownermode && tempdata[msg.author.id][msg.id].execCount >= 1 && data.guildData[msg.guild.id].chaincommands == false && !(msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.ManageGuild) || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.ManageMessages) || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) || msg.author.id === msg.guild.ownerId || isBot)) return 'You can\'t chain commands in this server.'
        if (!opts.ownermode && tempdata[msg.author.id][msg.id].execCount >= config.commandLimit * ((msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.ManageGuild) || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.ManageMessages) || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) || msg.author.id === msg.guild.ownerId || isBot) ? 5 : 1)) return `Number of commands to run at the same time must be smaller or equal to **${config.commandLimit * ((msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.ManageGuild) || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.ManageMessages) || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) || msg.author.id === msg.guild.ownerId || isBot) ? 5 : 1)}**!`
        tempdata[msg.author.id][msg.id].execCount++

        data.guildData[msg.guild.id].members[msg.author.id].coolDown = (data.guildData[msg.guild.id].members[msg.author.id].coolDown || Date.now()) + 2500 / ((msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.ManageGuild) || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.ManageMessages) || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) || msg.author.id === msg.guild.ownerId) ? 5 : 1)

        var message = await msg.reply({
            content: word,
            allowedMentions: fetchPingPerms(msg)
        }).catch(() => { })

        if (message) {
            return message.id
        }

        return ''
    },
    attemptvalue: 10
}
