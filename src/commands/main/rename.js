module.exports = {
    name: ['rename', 'nickname'],
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
        "name": "name",
        "required": true,
        "specifarg": false,
        "orig": "\"<name>\""
    }],
    execute: async function (msg, args) {
        let poopy = this
        let config = poopy.config
        let vars = poopy.vars
        let data = poopy.data
        let { DiscordTypes } = poopy.modules
        let { fetchPingPerms, resolveUser } = poopy.functions

        if (!(
            msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.ChangeNickname) ||
            msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.ManageNicknames) ||
            msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) ||
            (config.ownerids.find(id => id == msg.author.id))
        )) {
            await msg.reply(`You don't have the permission to change your own nickname... that's just hunky-doody y'know!`).catch(() => { })
            return
        }

        var saidMessage = args.slice(1).join(' ')
        var symbolReplacedMessage
        vars.symbolreplacements.forEach(symbolReplacement => {
            symbolReplacement.target.forEach(target => {
                symbolReplacedMessage = saidMessage.replace(new RegExp(target, 'ig'), symbolReplacement.replacement)
            })
        })
        var name = (symbolReplacedMessage.match(/"([\s\S]*?)"/) ?? [])[1]
        if (name) {
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

        var userQuery = symbolReplacedMessage
        if (name) userQuery = userQuery.replace(`"${name}"`, "").trim()
        else {
            name = symbolReplacedMessage.trim()
            userQuery = ""
        }

        var member = userQuery ? await resolveUser(userQuery, msg.guild, "member").catch(() => { }) : msg.member

        if (!member || (member != msg.member && !(
            msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.ManageNicknames) ||
            msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) ||
            (config.ownerids.find(id => id == msg.author.id))
        ))) {
            await msg.reply({
                content: !member ? `Invalid member: **${userQuery}**` : `You don't have the permission to change the nicknames of other users.`,
                allowedMentions: fetchPingPerms(msg)
            }).catch(() => { })
            return
        }

        if (!name) {
            await msg.reply('Where\'s the name?! If you wanna rename a different user, you gotta put the new name between quotes.').catch(() => { })
            return
        }

        if (name.length > 32) {
            await msg.reply('That name is TOO LONG!').catch(() => { })
            return
        }

        var oldName = member.displayName.replace(/\@/g, '@‌')

        var failed = false
        await member.setNickname(name).catch(() => failed = true)

        if (failed) {
            if (!msg.nosend) await msg.reply({
                content: `I couldn't change ${oldName}'s nickname. Make sure my highest role is above theirs!`,
                allowedMentions: fetchPingPerms(msg)
            }).catch(() => { })
            return `I couldn't change ${oldName}'s nickname. Make sure my highest role is above theirs!`
        }

        if (!msg.nosend) await msg.reply({
            content: `${oldName}'s nickname was set to **${name}**.`,
            allowedMentions: fetchPingPerms(msg)
        }).catch(() => { })
        return `${oldName}'s nickname was set to **${name}**.`
    },
    help: {
        name: 'rename/nickname [user (manage nicknames permission only)] "<name>"',
        value: 'Allows you to set a nickname on yourself or other users.'
    },
    cooldown: 2500,
    perms: ['Administrator', 'ManageNicknames', 'ChangeNickname'],
    type: 'Main'
}
