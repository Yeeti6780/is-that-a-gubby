module.exports = {
    helpf: '(msgID | collectPhrase<_name|resettimer()|stop(sendFinishPhrase)|source(...)> | timeout | finishPhrase<_collected> | name) (manage messages permission only)',
    desc: 'Creates a collector that receives any reactions made in the message with the respective ID, within the timeout.\n' +
        '**_reaction** - Keyword used for the reaction emoji\n' +
        '**_reactcount** - The reaction count for that emoji\n' +
        '**_authorid** - Returns the ID of who created the message collector\n' +
        "**resettimer()** - Resets the collector's timer\n" +
        "**stop(sendFinishPhrase)** - Stops the collector from running, sends the finishPhrase if sendFinishPhrase isn't blank.\n" +
        "**source(...)** - Perform a keyword execution using the variables of the user who made the message collector.\n" +
        '**_collected** - Used when the collector stops running, containing all collected reaction emojis.',
    func: async function (matches, msg, isBot, _, opts) {
        let poopy = this
        let { splitKeyFunc, parseKeywords, fetchPingPerms, deleteMsgData, createCollector, gatherData } = poopy.functions
        let { DiscordTypes, DummyMessage } = poopy.modules
        let config = poopy.config
        let data = poopy.data
        let bot = poopy.bot
        let tempdata = poopy.tempdata

        var word = matches[1]
        var split = splitKeyFunc(word, { args: 5 })
        var collectphrase = split[1] ?? ''
        split[0] = await parseKeywords(split[0] ?? '', msg, isBot, opts).catch(() => { }) || ''
        split[2] = await parseKeywords(split[2] ?? '', msg, isBot, opts).catch(() => { }) || ''
        split[4] = await parseKeywords(split[4] ?? '', msg, isBot, opts).catch(() => { }) || ''
        var bypassLimit = config.ownerids.find(id => id == msg.author.id) || isBot || opts.ownermode
        var timeout = isNaN(Number(split[2])) ? 10 : Number(split[2]) <= 1 ? 1 : (!bypassLimit && Number(split[2]) >= 60) ? 60 : Number(split[2]) || 10
        var finishphrase = split[3] ?? ''
        var name = split[4] ?? 'reactioncollector'
        var channel = msg.channel
        var guildid = msg.guild.id
        var channelid = channel.id
        var authorid = msg.author.id
        var messages = msg.channel.messages
        var message = messages.cache.get(split[0]) ?? await messages.fetch(split[0]).catch(() => { })

        if ((
            msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageGuild) ||
            msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageMessages) ||
            msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) ||
            msg.author.id === msg.guild.ownerId || config.ownerids.find(id => id == msg.author.id) ||
            isBot || msg.author.id == bot.user.id
        ) && message?.id) {
            var collectorData = tempdata[guildid][channelid][authorid]?.collectors ?? {}
            if (collectorData[name]) {
                collectorData[name].stop()
                delete collectorData[name]
            }

            if (Object.entries(collectorData).length >= 5) {
                return 'Collector limit exceeded.'
            }

            var filter = (r, u) => (config.allowbotusage || (data.guildData[msg.guild.id].chaos && !r.message.webhookId) || !u.bot) && u.id != bot.user.id
            var collected = []
            var collector = createCollector({
                id: message.id,
                type: "reaction", filter,
                time: !(bypassLimit && !split[2]) ? timeout * 1000 : undefined
            })

            collectorData[name] = collector

            collector.on('collect', async (reaction, user) => {
                var dummyMessage
                try {
                    if (tempdata[msg.guild.id][msg.channel.id].shutUp) return
                    var emoji = reaction.emoji.toString()

                    var valOpts = { ...opts }
                    valOpts.extraKeys = { ...valOpts.extraKeys }
                    valOpts.extraFuncs = { ...valOpts.extraFuncs }

                    valOpts.extraKeys._reaction = {
                        func: async () => {
                            return emoji
                        }
                    }
                    valOpts.extraKeys._reactcount = {
                        func: async () => {
                            return reaction.count
                        }
                    }
                    valOpts.extraKeys._authorid = {
                        func: async () => {
                            return msg.author.id
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
                            var content = await parseKeywords(word, msg, true, opts).catch((e) => console.log(e)) ?? word
                            return content
                        },
                        raw: true
                    }

                    valOpts.ownermode = false
                    valOpts.sourceMsg = msg

                    dummyMessage = new DummyMessage.Fake({
                        poopy, guild: msg.guild, channel: msg.channel,
                        member: msg.guild.members.cache.get(user.id)
                            ?? await msg.guild.members.fetch(user.id).catch(() => user)
                    })

                    var dataError = false
                    await gatherData(dummyMessage).catch((err) => dataError = err)
                    if (dataError) return console.log(dataError)
                    
                    var collect = await parseKeywords(collectphrase, dummyMessage, true, valOpts).catch((e) => console.log(e)) ?? ''

                    collected.push(emoji)

                    if (collect.trim()) await channel.send({
                        content: collect,
                        allowedMentions: fetchPingPerms(dummyMessage)
                    }).catch(() => { })
                } catch (_) { }

                deleteMsgData(dummyMessage)
            })

            collector.on('end', async (_, reason) => {
                try {
                    if (tempdata[msg.guild.id][msg.channel.id].shutUp) return
                    delete collectorData[name]
                    if (reason === 'time') {
                        var valOpts = { ...opts }
                        valOpts.extraKeys = { ...valOpts.extraKeys }

                        valOpts.extraKeys._collected = {
                            func: async () => {
                                return collected.join(' | ')
                            }
                        }

                        var finishphrasek = await parseKeywords(finishphrase, msg, isBot, valOpts).catch(() => { }) ?? ''

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
        keys: { _reaction: {}, _reactcount: {}, _authorid: {}, _collected: {} },
        funcs: { resettimer: {}, stop: {}, source: {} }
    },
    attemptvalue: 10
}
