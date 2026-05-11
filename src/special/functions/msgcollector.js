module.exports = {
    helpf: '(collectPhrase<_msg|resettimer()|stop(sendFinishPhrase)|source(...)> | timeout | finishPhrase<_collected>) (manage messages permission only)',
    desc: 'Creates a message collector that collects any messages sent in the channel, within the timeout.\n' +
        '**_msg** - Keyword used when a message is sent\n' +
        "**resettimer()** - Resets the collector's timer\n" +
        "**stop(sendFinishPhrase)** - Stops the collector from running, sends the finishPhrase if sendFinishPhrase isn't blank.\n" +
        "**source(...)** - Perform a keyword execution using the variables of the user who made the message collector.\n" +
        '**_collected** - Used when the collector stops running, containing all collected messages.',
    func: async function (matches, msg, isBot, _, opts) {
        let poopy = this
        let { splitKeyFunc, getKeywordsFor, dmSupport, fetchPingPerms, deleteMsgData, createCollector } = poopy.functions
        let { DiscordTypes } = poopy.modules
        let config = poopy.config
        let data = poopy.data
        let bot = poopy.bot
        let tempdata = poopy.tempdata

        var word = matches[1]
        var split = splitKeyFunc(word, { args: 3 })
        var collectphrase = split[0] ?? ''
        split[1] = await getKeywordsFor(split[1] ?? '', msg, isBot, opts).catch(() => { }) || ''
        var bypassLimit = config.ownerids.find(id => id == msg.author.id) || isBot || opts.ownermode
        var timeout = isNaN(Number(split[1])) ? 10 : Number(split[1]) <= 1 ? 1 : (!bypassLimit && Number(split[1]) >= 60) ? 60 : Number(split[1]) || 10
        var finishphrase = split[2] ?? ''
        var channel = msg.channel
        var guildid = msg.guild.id
        var channelid = channel.id
        var authorid = msg.author.id

        if (
            msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageGuild) ||
            msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageMessages) ||
            msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) ||
            msg.author.id === msg.guild.ownerId || config.ownerids.find(id => id == msg.author.id) ||
            isBot || msg.author.id == bot.user.id
        ) {
            if (tempdata[guildid][channelid][authorid].messageCollector) {
                tempdata[guildid][channelid][authorid].messageCollector.stop()
                delete tempdata[guildid][channelid][authorid].messageCollector
            }

            var filter = m => (config.allowbotusage || (data.guildData[msg.guild.id].chaos && !m.webhookId) || !m.author.bot) && m.author.id != bot.user.id
            var collected = []
            var collector = createCollector({
                id: `${channelid}_${authorid}`,
                type: "message", filter,
                time: !(bypassLimit && !split[1]) ? timeout * 1000 : undefined
            })

            tempdata[guildid][channelid][authorid].messageCollector = collector

            collector.on('collect', async m => {
                try {
                    if (tempdata[msg.guild.id][msg.channel.id].shutUp) return
                    var content = m.content

                    var valOpts = { ...opts }
                    valOpts.extraKeys = { ...valOpts.extraKeys }
                    valOpts.extraFuncs = { ...valOpts.extraFuncs }

                    valOpts.extraKeys._msg = {
                        func: async () => {
                            return content
                        }
                    }
                    valOpts.extraFuncs.resettimer = {
                        func: async () => {
                            collector.resetTimer()
                            return ''
                        }
                    }
                    valOpts.extraFuncs.stop = {
                        func: async (matches) => {
                            var word = matches[1]
                            collector.stop(word ? 'time' : 'user')
                            return ''
                        }
                    }
                    valOpts.extraFuncs.source = {
                        func: async (matches) => {
                            var word = matches[1]
                            var content = await getKeywordsFor(word, msg, true, opts).catch((e) => console.log(e)) ?? word
                            return content
                        },
                        raw: true
                    }

                    valOpts.ownermode = false
                    valOpts.sourceMsg = msg

                    var collect = await getKeywordsFor(collectphrase, m, true, valOpts).catch((e) => console.log(e)) ?? ''

                    collected.push(content)

                    if (collect.trim()) await channel.send({
                        content: collect,
                        allowedMentions: fetchPingPerms(msg)
                    }).catch(() => { })
                } catch (_) { }

                deleteMsgData(m)
            })

            collector.on('end', async (_, reason) => {
                try {
                    if (tempdata[msg.guild.id][msg.channel.id].shutUp) return
                    delete tempdata[guildid][channelid][authorid].messageCollector
                    if (reason === 'time') {
                        var valOpts = { ...opts }
                        valOpts.extraKeys = { ...valOpts.extraKeys }

                        valOpts.extraKeys._collected = {
                            func: async () => {
                                return collected.join(' | ')
                            }
                        }

                        var finishphrasek = await getKeywordsFor(finishphrase, msg, isBot, valOpts).catch(() => { }) ?? ''

                        if (finishphrasek.trim()) await channel.send({
                            content: finishphrasek,
                            allowedMentions: fetchPingPerms(msg)
                        }).catch(() => { })
                    }
                } catch (_) { }

                deleteMsgData(msg)
            })
        }

        return ''
    },
    raw: true,
    potential: {
        keys: { _msg: {}, _collected: {} },
        funcs: { resettimer: {}, stop: {}, source: {} }
    },
    attemptvalue: 10
}
