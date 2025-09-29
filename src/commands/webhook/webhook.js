module.exports = {
    name: ['webhook',
        'customhook',
        'customwebhook'],
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
        "name": "text",
        "required": false,
        "specifarg": false,
        "orig": "\"{text}\""
    },
    {
        "name": "image",
        "required": false,
        "specifarg": false,
        "orig": "{image}"
    }],
    execute: async function (msg, args) {
        let poopy = this
        let config = poopy.config
        let vars = poopy.vars
        let data = poopy.data
        let { DiscordTypes } = poopy.modules
        let { dataGather, fetchPingPerms, resolveUser } = poopy.functions

        var saidMessage = args.slice(1).join(' ')
        var symbolReplacedMessage
        vars.symbolreplacements.forEach(symbolReplacement => {
            symbolReplacement.target.forEach(target => {
                symbolReplacedMessage = saidMessage.replace(new RegExp(target, 'ig'), symbolReplacement.replacement)
            })
        })
        var name = (symbolReplacedMessage.match(/^"([\s\S]*?)"/) ?? [])[1]
        if (name) {
            if (name.length > 32) {
                await msg.reply('That name is TOO LONG!').catch(() => { })
                return
            }
            
            var allBlank = true

            for (var i = 0; i < name.length; i++) {
                var letter = name[i]
                if (letter !== ' ') {
                    allBlank = false
                }
            }

            if (allBlank) {
                await msg.reply('Invalid name.').catch(() => { })
                return
            }
        }
        var avatar = vars.validUrl.test(args[args.length - 1]) && args[args.length - 1]

        var userQuery = symbolReplacedMessage
        if (name) userQuery = userQuery.replace(`"${name}"`, "").trim()
        if (avatar) userQuery = userQuery.replace(avatar, "").trim()

        var member = userQuery ? await resolveUser(userQuery, msg.guild, "member").catch(() => { }) : msg.author

        if (!member) {
            await msg.reply({
                content: `Invalid member: **${userQuery}**`,
                allowedMentions: fetchPingPerms(msg)
            }).catch(() => { })
            return
        }

        member = member.user ?? member

        if (!data.guildData[msg.guild.id].members[member.id]) {
            data.guildData[msg.guild.id].members[member.id] = !config.testing && process.env.MONGODB_URL && await dataGather.memberData(config.database, msg.guild.id, msg.author.id).catch(() => { }) || {}
        }

        if (!data.guildData[msg.guild.id].members[member.id].custom) {
            data.guildData[msg.guild.id].members[member.id].custom = false
        }

        if (data.guildData[msg.guild.id].members[member.id].custom === false) {
            if (msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.ManageWebhooks) || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.ManageGuild) || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.ManageMessages) || msg.author.id === msg.guild.ownerId || config.ownerids.find(id => id == msg.author.id)) {
                if (!name) {
                    await msg.reply('Where\'s the name?!').catch(() => { })
                    return
                }
                if (!avatar) {
                    await msg.reply('Where\'s the avatar?!').catch(() => { })
                    return
                }

                data.guildData[msg.guild.id].members[member.id].custom = {
                    name: name,
                    avatar: avatar
                }

                if (!msg.nosend) await msg.reply({
                    content: member.displayName.replace(/\@/g, '@‌') + ` is now ${name}.`,
                    allowedMentions: fetchPingPerms(msg)
                }).catch(() => { })
                return member.displayName.replace(/\@/g, '@‌') + ` is now ${name}.`
            } else {
                await msg.reply('You need to have the manage webhooks/messages permission to execute that!').catch(() => { })
                return;
            }
        } else {
            if (!msg.nosend) await msg.reply({
                content: member.displayName.replace(/\@/g, '@‌') + ` is not ${data.guildData[msg.guild.id].members[member.id].custom.name}.`,
                allowedMentions: fetchPingPerms(msg)
            }).catch(() => { })
            data.guildData[msg.guild.id].members[member.id].custom = false
            return member.displayName.replace(/\@/g, '@‌') + ` is not ${data.guildData[msg.guild.id].members[member.id].custom.name}.`
        }
    },
    help: {
        name: 'webhook/customhook/customwebhook [user] "{text}" {image} (manage webhooks/messages permission only)',
        value: 'Turns someone into the webhook you specified.'
    },
    cooldown: 2500,
    perms: ['Administrator',
        'ManageWebhooks',
        'ManageMessages'],
    type: 'Webhook'
}
