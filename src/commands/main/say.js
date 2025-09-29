module.exports = {
    name: ['say', 'talk', 'speak'],
    args: [{ "name": "message", "required": true, "specifarg": false, "orig": "<message>" }, { "name": "nodelete", "required": false, "specifarg": true, "orig": "[-nodelete]" }, { "name": "tts", "required": false, "specifarg": true, "orig": "[-tts]" }],
    execute: async function (msg, args) {
        let poopy = this
        let config = poopy.config
        let { Discord, DiscordTypes } = poopy.modules
        let { fetchPingPerms } = poopy.functions

        await msg.channel.sendTyping().catch(() => { })
        var del = (
            msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.ManageMessages) ||
            msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) ||
            msg.author.id === msg.guild.ownerId ||
            (config.ownerids.find(id => id == msg.author.id))
        ) && !msg.isUserApp
        var deleteIndex = args.indexOf('-nodelete')
        if (deleteIndex > -1) {
            args.splice(deleteIndex, 1)
            del = false
        }
        var tts = false
        var ttsIndex = args.indexOf('-tts')
        if (ttsIndex > -1) {
            args.splice(ttsIndex, 1)
            tts = true
        }
        var saidMessage = args.slice(1).join(' ')
        var attachments = msg.attachments.map(attachment => new Discord.AttachmentBuilder(attachment.url, attachment.name))
        if (args[1] === undefined && attachments.length <= 0 && msg.stickers.size <= 0) {
            await msg.reply('What is the message to say?!').catch(() => { })
            return
        };
        var sendObject = {
            allowedMentions: fetchPingPerms(msg),
            files: attachments,
            stickers: msg.stickers,
            tts: (
                msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) ||
                msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.SendTTSMessages) ||
                msg.author.id === msg.guild.ownerId
            ) && tts
        }
        if (saidMessage) {
            sendObject.content = saidMessage
        }
        var reply = await msg.fetchReference().catch(() => { })
        if (reply) {
            if (!msg.nosend) await reply.reply(sendObject).catch(() => { })
        } else {
            if (del || (msg.replied && msg.deferred && !msg.isUserApp)) {
                if (!msg.nosend) await msg.channel.send(sendObject).catch(() => { })

                if (msg.type === DiscordTypes.InteractionType.ApplicationCommand && !msg.replied) await msg.editReply({
                    content: 'Successfully sent.'
                }).catch(() => { })
                else msg.delete().catch(() => { })
            } else {
                if (!msg.nosend) await msg.reply(sendObject).catch(() => { })
            }
        }
        return saidMessage
    },
    help: {
        name: 'say/talk/speak <message> [-nodelete] [-tts]',
        value: 'Poopy says the message after the command.'
    },
    cooldown: 2500,
    ephemeral: true,
    type: 'Main'
}
