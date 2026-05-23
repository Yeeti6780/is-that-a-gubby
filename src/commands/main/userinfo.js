module.exports = {
    name: ['userinfo', 'whois'],
    args: [{
        name: "user", required: true, specifarg: false, orig: "<user>",
        autocomplete: async function (interaction) {
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
        name: "global",
        required: false,
        specifarg: true,
        orig: "[-global]"
    }],
    execute: async function (msg, args) {
        let poopy = this
        let bot = poopy.bot
        let { DiscordTypes } = poopy.modules
        let { fetchPingPerms, resolveUser, getOption } = poopy.functions
        let config = poopy.config

        var global = getOption(args, 'global', { n: 0, splice: true, dft: false })

        var userQuery = args.slice(1).join(' ')

        var member = userQuery ? await resolveUser(userQuery, msg.guild) : msg.member

        if (!member) {
            await msg.reply({
                content: `Invalid user: **${userQuery}**`,
                allowedMentions: fetchPingPerms(msg)
            }).catch(() => { })
            return
        }

        var user = await (member.user ?? member).fetch(true).catch(() => { })
            ?? (member.user ?? member)
        if (global) member = member.user ?? member

        var avatar = member.displayAvatarURL({ dynamic: true, size: 1024, extension: 'png' })
        var banner = member.displayBannerURL ?
            member.displayBannerURL({ dynamic: true, size: 1024, extension: 'png' }) :
            member.bannerURL({ dynamic: true, size: 1024, extension: 'png' })

        var urls = [`[Avatar URL](${avatar})`]
        if (banner) urls.push(`[Banner URL](${banner})`)

        var infoEmbed = {
            author: {
                name: `${member.displayName?.replace(/\@/g, '@‌')} (${user?.tag ?? member.displayName?.replace(/\@/g, '@‌')})`,
                icon_url: avatar
            },
            description: urls.join(' '),
            color: 0x472604,
            thumbnail: {
                url: avatar
            },
            image: banner ? {
                url: banner
            } : undefined,
            footer: {
                icon_url: bot.user.displayAvatarURL({ dynamic: true, size: 1024, extension: 'png' }),
                text: bot.user.displayName
            },
            fields: []
        }

        var status = {
            online: '🟢 Online',
            idle: '🌙 Idle',
            dnd: '⛔ Do Not Disturb',
            offline: '⚫ Offline/Invisible'
        }

        var badgeEmojis = {
            ActiveDeveloper: `<:ActiveDeveloper:1507802170311966720>`,
            Boost1Month: `<:Boost1Month:1507801863779647619>`,
            Boost2Month: `<:Boost2Month:1507801873724211420>`,
            Boost3Month: `<:Boost3Month:1507801894146277447>`,
            Boost6Month: `<:Boost6Month:1507801895060902040>`,
            Boost9Month: `<:Boost9Month:1507802172186955817>`,
            Boost12Month: `<:Boost12Month:1507802173407367322>`,
            Boost15Month: `<:Boost15Month:1507802174514794628>`,
            Boost18Month: `<:Boost18Month:1507802176381259798>`,
            Boost24Month: `<:Boost24Month:1507802177710850080>`,
            Bot: `<:Bot1:1507802179724116138><:Bot2:1507802181196054698>`,
            BotHTTPInteractions: `<:BotHTTPInteractions:1507802182492098751>`,
            BugHunterLevel1: `<:BugHunter:1507802183712637079>`,
            BugHunterLevel2: `<:BugHunterLevel2:1507802185277112493>`,
            CertifiedModerator: `<:CertifiedModerator:1507802186606968902>`,
            GuildOwner: `<:GuildOwner:1507802187835642038>`,
            Hypesquad: `<:HypesquadEvent:1507802196044157088>`,
            HypeSquadOnlineHouse1: `<:HypeSquadBravery:1507802192801955930>`,
            HypeSquadOnlineHouse2: `<:HypeSquadBrilliance:1507802194253054093>`,
            HypeSquadOnlineHouse3: `<:HypeSquadBalance:1507802189265895494>`,
            Nitro: `<:Nitro:1507802197352779836>`,
            Partner: `<:Partner:1507802199974084608>`,
            PremiumEarlySupporter: `<:NitroEarlySupporter:1507802198569123921>`,
            Quarantined: `<:Quarantined:1507802204705263779>`,
            Spammer: `<:Spammer:1507802202297602218>`,
            Staff: `<:Staff:1507802206680907886>`,
            System: `<:System1:1507802207880478820><:System2:1507802209310478377><:System3:1507802210589741257><:System4:1507802211755757710>`,
            TeamPseudoUser: `<:TeamPseudoUser:1507802213379080202>`,
            VerifiedBot: `<:VerifiedBot1:1507802214998212689><:VerifiedBot2:1507802216558497842><:VerifiedBot3:1507802217992945794>`,
            VerifiedDeveloper: `<:VerifiedDeveloper:1507802219649437879>`
        }

        var userFlags = user?.flags ? user.flags.toArray() : []
        var flags = []

        if (user?.id == msg.guild.ownerId) flags.push('GuildOwner')
        if (member.premiumSince) {
            flags.push('Nitro')

            var now = new Date()
            var months = (now.getFullYear() - member.premiumSince.getFullYear()) * 12 - now.getMonth() + member.premiumSince.getMonth()
            var tiers = [24, 18, 15, 12, 9, 6, 3, 2, 1]

            for (var tier of tiers) {
                if (months >= tier) {
                    flags.push(`Boost${tier}Month`)
                    break
                }
            }
        }
        if (user?.system) flags.push('System')
        else if (user?.bot) {
            var verifiedBot = userFlags.indexOf('VerifiedBot')
            if (verifiedBot > -1) userFlags.splice(verifiedBot, 1)
            flags.push(verifiedBot > -1 ? 'VerifiedBot' : 'Bot')
        }
        flags = flags.concat(userFlags)

        infoEmbed.fields.push({
            name: 'ID',
            value: `\`${user?.id}\``,
            inline: true
        })
        infoEmbed.fields.push({
            name: 'Created',
            value: `<t:${Math.floor((user?.createdTimestamp ?? 0) / 1000)}:R>`,
            inline: true
        })
        if (member.joinedTimestamp) infoEmbed.fields.push({
            name: 'Joined',
            value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`,
            inline: true
        })
        if (flags.length) infoEmbed.fields.push({
            name: 'Badges',
            value: flags.map(b => !config.self && badgeEmojis[b] || b).join(' '),
            inline: true
        })

        if (member.presence) {
            infoEmbed.fields.push({
                name: 'Status',
                value: status[member.presence.status],
                inline: true
            })

            if (member.presence.activities?.length) {
                var emoji
                var text

                for (var activity of member.presence.activities) {
                    if (activity.emoji && !emoji) emoji = activity.emoji.toString()
                    if ((activity.state || activity.name) && !text) text = activity.type == DiscordTypes.ActivityType.Custom ? activity.state : `${DiscordTypes.ActivityType[activity.type]} ${activity.type === DiscordTypes.ActivityType.Competing && 'in ' || activity.type === DiscordTypes.ActivityType.Listening && 'to ' || ''}**${activity.name}**`
                }

                var activity
                if (emoji && text) activity = `${emoji} ${text}`
                else activity = emoji ?? text

                infoEmbed.fields.push({
                    name: 'Activity',
                    value: activity,
                    inline: true
                })
            }
        }

        if (member.roles) {
            infoEmbed.fields.push({
                name: 'Roles',
                value: member.roles.cache.sort((a, b) => b.rawPosition - a.rawPosition).map(role => role.toString()).join(' '),
                inline: true
            })
        }

        if (!msg.nosend) {
            if (config.textEmbeds) msg.reply({
                content: `${infoEmbed.author.name}\n\n${infoEmbed.description}\n${infoEmbed.fields.map(p => `**${p.name}**: ${p.value}`).join('\n')}`,
                allowedMentions: {
                    parse: []
                }
            }).catch(() => { })
            else msg.reply({
                embeds: [infoEmbed]
            }).catch(() => { })
        }
        return `${infoEmbed.author.name}\n\n${infoEmbed.description}\n${infoEmbed.fields.map(p => `**${p.name}**: ${p.value}`).join('\n')}`
    },
    help: {
        name: 'userinfo/whois <user> [-global]',
        value: "Shows a user's server/global info."
    },
    cooldown: 2500,
    type: 'Main'
}
