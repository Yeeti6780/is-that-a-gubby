module.exports = {
    name: ['cleverbot', 'respond'],
    args: [
        {
            name: "message",
            required: false,
            specifarg: false,
            orig: "{message}"
        },
        {
            name: "continuous",
            required: false,
            specifarg: true,
            orig: "[-continuous]"
        },
        {
            name: "clear",
            required: false,
            specifarg: true,
            orig: "[-clear]"
        }
    ],
    execute: async function (msg, args) {
        let poopy = this
        let { cleverbot, dmSupport, parseKeywords, getOption, fetchPingPerms, deleteMsgData, createCollector } = poopy.functions
        let tempdata = poopy.tempdata
        let bot = poopy.bot

        var continuous = getOption(args, 'continuous', { n: 0, splice: true, dft: false })
        var clear = getOption(args, 'clear', { n: 0, splice: true, dft: false })

        var channel = msg.channel
        var guildid = msg.guild.id
        var channelid = channel.id
        var authorid = msg.author.id

        var saidMessage = args.slice(1).join(' ')
        if (saidMessage) {
            var resp = await cleverbot(saidMessage, msg, clear).catch(err => {
                channel.send({
                    content: err.stack,
                    allowedMentions: fetchPingPerms(msg)
                }).catch(() => { })
            })

            if (resp) {
                if (!msg.nosend) channel.send({
                    content: resp,
                    allowedMentions: fetchPingPerms(msg)
                }).catch(() => { })
                return resp
            }
        } else if (!msg.nosend) {
            if (!continuous && !args[1]) {
                await channel.send('What is the message to respond to?!').catch(() => { })
                return
            }
            await channel.send('Hello, I will respond to your messages now.').catch(() => { })
        }

        channel.sendTyping().catch(() => { })

        if (!msg.nosend && continuous) {
            var collectorData = tempdata[guildid][channelid][authorid]?.collectors ?? {}
            if (collectorData.cleverbot) {
                collectorData.cleverbot.stop()
                delete collectorData.cleverbot
            }

            if (Object.entries(collectorData).length >= 5) {
                await channel.send('Collector limit exceeded.').catch(() => { })
                return
            }

            var filter = m => !m.author.bot && m.author.id != bot.user.id && m.author.id === msg.author.id
            var collector = createCollector({
                id: `${channel.id}_${msg.author.id}`,
                type: "message", filter, time: 30000
            })

            collectorData.cleverbot = collector

            collector.on('collect', async m => {
                try {
                    dmSupport(m)

                    if (tempdata[msg.guild.id][msg.channel.id].shutUp) return

                    var content = await parseKeywords(m.content ?? '', m, false).catch(() => { }) ?? m.content

                    collector.resetTimer()

                    var resp = await cleverbot(content, m).catch(err => {
                        channel.send({
                            content: err.stack,
                            allowedMentions: fetchPingPerms(m)
                        }).catch(() => { })
                    })

                    if (resp) {
                        channel.send({
                            content: resp,
                            allowedMentions: fetchPingPerms(m)
                        }).catch(() => { })
                    }
                } catch (_) { }

                deleteMsgData(m)
            })

            collector.on('end', async (_, reason) => {
                try {
                    if (tempdata[msg.guild.id][msg.channel.id].shutUp) return
                    delete collectorData.cleverbot
                    if (reason === 'time') {
                        channel.send({
                            content: 'I\'m running out of time...',
                            allowedMentions: fetchPingPerms(m)
                        }).catch(() => { })
                    }
                } catch (_) { }
            })
        }
    },
    help: {
        name: 'cleverbot/respond {message} [-continuous] [-clear]',
        value: "The bot responds to your message(s) with Cleverbot's AI. Try it yourself at https://www.cleverbot.com/"
    },
    type: 'Generation'
}