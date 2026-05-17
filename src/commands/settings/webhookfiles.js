module.exports = {
    name: ['webhookfiles', 'togglefiles'],
    args: [],
    execute: async function (msg, _, opts) {
        let poopy = this
        let data = poopy.data
        let config = poopy.config
        let { fetchPingPerms } = poopy.functions
        let { DiscordTypes } = poopy.modules

        if (opts.sourceMsg && msg.author.id != opts.sourceMsg.author.id) {
            await msg.reply("bro").catch(() => { })
            return
        }

        var hasPerms = msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageGuild)
            || msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageMessages)
            || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator)
            || msg.author.id === msg.guild.ownerId
            || config.ownerids.find(id => id == msg.author.id)

        if (!hasPerms) {
            await msg.reply('You need to be a moderator to execute that!').catch(() => { })
            return
        }

        data.guildData[msg.guild.id].webhookAttachments = !data.guildData[msg.guild.id].webhookAttachments

        if (!msg.nosend) await msg.reply({
            content: `Attachments from webhooks have been **${data.guildData[msg.guild.id].webhookAttachments ? 'enabled' : 'disabled'}**.`,
            allowedMentions: fetchPingPerms(msg)
        }).catch(() => { })
        return `Attachments from webhooks have been **${data.guildData[msg.guild.id].webhookAttachments ? 'enabled' : 'disabled'}**.`
    },
    help: {
        name: 'webhookfiles/togglefiles',
        value: "Disables/enables the bot's ability to attach files to webhooks, resulting in faster sending speeds at the cost of having them become lost media..."
    },
    cooldown: 2500,
    type: 'Settings'
}