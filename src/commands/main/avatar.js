module.exports = {
    name: ['avatar',
        'av',
        'pfp'],
    args: [{
        "name": "user",
        "required": false,
        "specifarg": false,
        "orig": "[user]",
        "autocomplete": async function (interaction) {
            let poopy = this
            let { data, config } = poopy
            let { dataGather } = poopy.functions

            if (!data.guildData[interaction.guild.id]) {
                data.guildData[interaction.guild.id] = !config.testing && process.env.MONGODB_URL && await dataGather.guildData(config.database, interaction.guild.id).catch((e) => console.log(e)) || {}
            }

            var memberData = data.guildData[interaction.guild.id].allMembers ?? {}
            var memberKeys = Object.keys(memberData).sort((a, b) => memberData[b].messages - memberData[a].messages)

            return memberKeys.map(id => {
                return { name: memberData[id].username, value: id }
            })
        }
    },
    {
        "name": "global",
        "required": false,
        "specifarg": true,
        "orig": "[-global]"
    }],
    execute: async function (msg, args) {
        let poopy = this
        let bot = poopy.bot
        let config = poopy.config
        let { Discord } = poopy.modules
        let { fetchPingPerms, getOption, resolveUser } = poopy.functions

        msg.channel.sendTyping().catch(() => {})

        var global = getOption(args, 'global', { n: 0, splice: true, dft: false })

        var userQuery = args.slice(1).join(' ')

        var member = userQuery ? await resolveUser(userQuery, msg.guild) : msg.member

        if (!member) {
            await msg.reply({
                content: `Invalid user: **${userQuery}**`,
                allowedMentions: fetchPingPerms(msg)
            }).catch(() => {})
            return
        }

        var username = member.displayName ?? member.user.displayName
        if (global) member = member.user ?? member

        var avatar = new Discord.AttachmentBuilder(member.displayAvatarURL({
            dynamic: true, size: 1024, extension: 'png'
        }))
        
        var parsedAvatar = new URL(avatar.attachment)

        var avObject = {
            allowedMentions: fetchPingPerms(msg),
            files: [avatar]
        }

        if (config.textEmbeds) avObject.content = username + '\'s avatar is:'
        else avObject.embeds = [{
            title: username + '\'s Avatar',
            color: 0x472604,
            footer: {
                icon_url: bot.user.displayAvatarURL({ dynamic: true, size: 1024, extension: 'png' }),
                text: bot.user.displayName
            },
            image: {
                url: `attachment://${parsedAvatar.pathname.split('/').pop()}`
            }
        }]

        if (!msg.nosend) await msg.reply(avObject).catch(() => {})
        return avatar
    },
    help: {
        name: 'avatar/av/pfp [user] [-global]',
        value: "Replies with the user's server/global avatar."
    },
    cooldown: 2500,
    type: 'Main'
}