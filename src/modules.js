let modules = {}
let activeBots = require('./dataValues').activeBots

modules.Discord = [require('discord.js')]
modules.DiscordTypes = require('discord-api-types/v10')

modules.fs = require('fs-extra')
modules.nodefs = require('fs')
modules.path = require('path')
modules.archiver = require('archiver')
modules.fileType = require('file-type')
modules.axios = require('axios')
modules.cuimp = require('cuimp')
modules.FormData = require('form-data')
modules.cheerio = require('cheerio')
modules.xml2json = require('xml2js').parseStringPromise
modules.util = require('util')
modules.cron = require('cron')
modules.CryptoJS = require('crypto-js')
modules.Jimp = require('jimp')
for (var [name, func] of Object.entries(require('../lib/jimpPrint/measureText'))) {
    modules.Jimp[name] = func
}
for (var [name, func] of Object.entries(require('../lib/jimpPrint/printText'))) {
    modules.Jimp[name] = func
}
modules.catbox = require('catbox.moe')
modules.mathjs = require('mathjs')
modules.prettyBytes = require('pretty-bytes')
modules.pluralize = require('pluralize')
modules.itob = require('istextorbinary')
modules.os = require('os')
modules.EventEmitter = require('events')
modules.Worker = require('worker_threads').Worker
modules.Collection = require('@discordjs/collection').Collection
modules.Rainmaze = require('../lib/rainmaze/Rainmaze')
modules.DummyMessage = require('./dummyMessage')
modules.GenAIWorker = require('./genAIWorker')
modules.HTTPClientUtils = require('./httpClientUtils')
modules.DMGuild = class DMGuild {
    constructor(msg) {
        let members = new modules.Collection([[msg.client.user.id, msg.client.user]].concat(
            msg.channel.recipients ?
                [...msg.channel.recipients] :
                msg.channel.recipient ?
                    [[msg.channel.recipient.id, msg.channel.recipient]] :
                    [[msg.author.id, msg.author]]
        ))

        this.ownerId = msg.channel.ownerId || msg.channel.recipient?.id || msg.author?.id || msg.id
        this.id = msg.channel.id
        this.name = msg.channel.name || `${(msg.user || msg.author).displayName}'s DMs`
        this.fetchAuditLogs = async () => {
            return {
                entries: new modules.Collection()
            }
        }
        this.search = async () => new modules.Collection()
        this.emojis = {
            cache: new modules.Collection()
        }
        this.channels = {
            cache: new modules.Collection([[msg.channel.id, msg.channel]])
        }
        this.members = {
            fetch: async (id) => members.get(id),
            resolve: (id) => members.get(id),
            cache: members,
            me: members.get(msg.client.user.id)
        }
    }
}

if (process.env.GOOGLE_KEY) {
    const google = require('googleapis').google

    modules.youtube = google.youtube({
        version: 'v3',
        auth: process.env.GOOGLE_KEY
    })
}

for (var Discord of modules.Discord) {
    const channelClasses = [
        Discord.BaseGuildTextChannel,
        Discord.DMChannel
    ]

    for (const Channel of channelClasses) {
        const channelSend = Channel?.prototype?.send
        if (!channelSend) continue

        Channel.prototype.send = async function send(payload) {
            var channel = this
            let client = channel.client
            let poopy = activeBots[client.database]
            let vars = poopy.vars
            let tempdata = poopy.tempdata
            let globaldata = poopy.globaldata
            let {
                waitMessageCooldown,
                setMessageCooldown,
                parseKeywords,
                rotAllAway
            } = poopy.functions

            await waitMessageCooldown()

            const channelData = tempdata[channel.guild?.id]?.[channel.id]

            if (channelData?.shutUp) return
            if (channelData?.forceResponse && (typeof payload == 'object' ? (
                payload.content ||
                payload.files || payload.embeds ||
                payload.stickers
            ) : payload) && !channelData.forceResponse.repliesOnly) {
                var forceres = channelData.forceResponse
                delete channelData.forceResponse

                var content = typeof payload == 'object' ? (payload.content ?? '') : payload
                var msg = forceres.msg
                var res = await parseKeywords(forceres.res, msg, true, {
                    resetAttempts: true,
                    extraKeys: {
                        _msg: {
                            func: async () => {
                                return content
                            }
                        }
                    }
                }).catch(() => { }) ?? forceres.res

                if (forceres.persist && !channelData.forceResponse) channelData.forceResponse = forceres

                switch (typeof payload) {
                    case 'string':
                        if (payload.trim()) {
                            payload = {
                                content: res,
                                allowedMentions: {
                                    parse: []
                                }
                            }
                        }
                        break;
                    case 'object':
                        if ((payload.content ?? "").trim()) {
                            payload.content = res
                        }
                        break;
                }
            }

            //if (
            //    typeof payload == "string" ?
            //    !(payload.trim()) : (
            //    !((payload.content ?? "").trim()) &&
            //    !payload.files?.length &&
            //    !payload.attachments?.length &&
            //    !payload.embeds?.length &&
            //    !payload.stickers?.length &&
            //    !payload.components?.length
            //)) throw "Can't send empty message"

            if (vars.currentIpAddress) {
                switch (typeof payload) {
                    case 'string':
                        if (payload.includes(vars.currentIpAddress))
                            payload = "Output contains current IP address."
                        break

                    case 'object':
                        if ((payload.content ?? "").includes(vars.currentIpAddress))
                            payload.content = "Output contains current IP address."
                }
            }

        payload = await rotAllAway(payload).catch(() => { })

            return channelSend.call(channel, payload).then(setMessageCooldown)
        }
    }


    const Message = Discord.Message
    const messageReply = Message.prototype.reply

    Message.prototype.reply = async function reply(payload) {
        var message = this
        let client = message.client
        let poopy = activeBots[client.database]
        let vars = poopy.vars
        let config = poopy.config
        let tempdata = poopy.tempdata
        let globaldata = poopy.globaldata
        let {
            waitMessageCooldown,
            setMessageCooldown,
            parseKeywords,
            rotAllAway
        } = poopy.functions

        await waitMessageCooldown()

        const channelData = tempdata[message.guild?.id]?.[message.channel.id]

        if (channelData?.shutUp) return
        if (channelData?.forceResponse && (typeof payload == 'object' ? (
            payload.content ||
            payload.files || payload.embeds ||
            payload.stickers
        ) : payload) && !channelData.forceResponse.repliesOnly) {
            var forceres = channelData.forceResponse
            delete channelData.forceResponse

            var content = typeof payload == 'object' ? (payload.content ?? '') : payload
            var msg = message
            var res = await parseKeywords(forceres.res, msg, true, {
                resetAttempts: true,
                extraKeys: {
                    _msg: {
                        func: async () => {
                            return content
                        }
                    }
                }
            }).catch(() => { }) ?? forceres.res

            if (forceres.persist && !channelData.forceResponse) channelData.forceResponse = forceres

            switch (typeof payload) {
                case 'string':
                    if (payload.trim()) {
                        payload = {
                            content: res,
                            allowedMentions: {
                                parse: []
                            }
                        }
                    }
                    break;
                case 'object':
                    if ((payload.content ?? "").trim()) {
                        payload.content = res
                    }
                    break;
            }
        }

        //if (
        //    typeof payload == "string" ?
        //    !(payload.trim()) : (
        //    !((payload.content ?? "").trim()) &&
        //    !payload.files?.length &&
        //    !payload.attachments?.length &&
        //    !payload.embeds?.length &&
        //    !payload.stickers?.length &&
        //    !payload.components?.length
        //)) throw "Can't send empty message"

        if (vars.currentIpAddress) {
            switch (typeof payload) {
                case 'string':
                    if (payload.includes(vars.currentIpAddress))
                        payload = "Output contains current IP address."
                    break

                case 'object':
                    if ((payload.content ?? "").includes(vars.currentIpAddress))
                        payload.content = "Output contains current IP address."
            }
        }

        payload = await rotAllAway(payload).catch(() => { })

        if (config.allowbotusage || message.replied) return message.channel.send(payload).then(setMessageCooldown)
        else {
            return messageReply.call(message, payload).then(reply => {
                Object.defineProperty(message, 'replied', {
                    value: reply,
                    writable: true
                })
                return setMessageCooldown(reply)
            })
        }
    }

    const interactionClasses = [
        Discord.CommandInteraction,
        Discord.MessageComponentInteraction
    ]

    for (const Interaction of interactionClasses) {
        const interactionReply = Interaction?.prototype?.reply
        if (!interactionReply) continue

        Interaction.prototype.reply = async function reply(payload) {
            var interaction = this
            let client = interaction.client
            let poopy = activeBots[client.database]
            let vars = poopy.vars
            let config = poopy.config
            let tempdata = poopy.tempdata
            let globaldata = poopy.globaldata
            let {
                waitMessageCooldown,
                setMessageCooldown,
                parseKeywords,
                rotAllAway
            } = poopy.functions

            await waitMessageCooldown()

            const channelData = tempdata[interaction.guild?.id]?.[interaction.channel.id]

            if (channelData?.shutUp) return
            if (channelData?.forceResponse && (typeof payload == 'object' ? (
                payload.content ||
                payload.files || payload.embeds ||
                payload.stickers
            ) : payload) && !channelData.forceResponse.repliesOnly) {
                var forceres = channelData.forceResponse
                delete channelData.forceResponse

                var content = typeof payload == 'object' ? (payload.content ?? '') : payload
                var msg = interaction
                var res = await parseKeywords(forceres.res, msg, true, {
                    resetAttempts: true,
                    extraKeys: {
                        _msg: {
                            func: async () => {
                                return content
                            }
                        }
                    }
                }).catch(() => { }) ?? forceres.res

                if (forceres.persist && !channelData.forceResponse) channelData.forceResponse = forceres

                switch (typeof payload) {
                    case 'string':
                        if (payload.trim()) {
                            payload = {
                                content: res,
                                allowedMentions: {
                                    parse: []
                                }
                            }
                        }
                        break;
                    case 'object':
                        if ((payload.content ?? "").trim()) {
                            payload.content = res
                        }
                        break;
                }
            }

            //if (
            //    typeof payload == "string" ?
            //    !(payload.trim()) : (
            //    !((payload.content ?? "").trim()) &&
            //    !payload.files?.length &&
            //    !payload.attachments?.length &&
            //    !payload.embeds?.length &&
            //    !payload.stickers?.length &&
            //    !payload.components?.length
            //)) throw "Can't send empty message"

            if (vars.currentIpAddress) {
                switch (typeof payload) {
                    case 'string':
                        if (payload.includes(vars.currentIpAddress))
                            payload = "Output contains current IP address."
                        break

                    case 'object':
                        if ((payload.content ?? "").includes(vars.currentIpAddress))
                            payload.content = "Output contains current IP address."
                }
            }

            payload = await rotAllAway(payload).catch(() => { })

            if (config.allowbotusage || interaction.replied) {
                if (interaction.isUserApp) return interaction.followUp(payload).then(setMessageCooldown)
                else return interaction.channel.send(payload).then(setMessageCooldown)
            } else {
                return (!interaction.replied && interaction.deferred ?
                    interaction.editReply(payload) :
                    interactionReply.call(interaction, payload)
                ).then(reply => {
                    Object.defineProperty(interaction, 'replied', {
                        value: reply,
                        writable: true
                    })
                    return setMessageCooldown(reply)
                })
            }
        }
    }
}

module.exports = modules
