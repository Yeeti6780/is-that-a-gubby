module.exports = {
    name: ['setprefix'],
    args: [{ name: "prefix", required: true, specifarg: false, orig: "<prefix>" }],
    execute: async function (msg, args, opts) {
        let poopy = this
        let config = poopy.config
        let data = poopy.data
        let { DiscordTypes } = poopy.modules
        let { fetchPingPerms } = poopy.functions

        if (opts.sourceMsg && msg.author.id != opts.sourceMsg.author.id) {
            await msg.reply("bro").catch(() => { })
            return
        }

        if (msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageGuild) || msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageMessages) || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) || msg.author.id === msg.guild.ownerId || config.ownerids.find(id => id == msg.author.id)) {
            if (args[1] === undefined) {
                await msg.reply('You must specify a prefix!').catch(() => { })
                return
            }
            for (var i in args) {
                var arg = args[i]
                if (arg == '') {
                    args.splice(i, 1)
                }
            }
            var saidMessage = args.slice(1).join(' ').split(/[\s]+/).join(' ')
            if (saidMessage.length > 20) {
                await msg.reply('The prefix can\'t be bigger than 20 characters.').catch(() => { })
                return
            }
            data.guildData[msg.guild.id].prefix = saidMessage
            if (!msg.nosend) await msg.reply({
                content: `The prefix was set to \`${saidMessage}\` (if this is wrong, mention me with "reset prefix")`,
                allowedMentions: fetchPingPerms(msg)
            }).catch(() => { })
            return `The prefix was set to \`${saidMessage}\` (if this is wrong, mention me with "reset prefix")`
        } else {
            await msg.reply('You need to be a moderator to execute that!').catch(() => { })
            return;
        };
    },
    help: {
        name: 'setprefix <prefix> (moderator only)',
        value: "Set the bot's prefix to anything you want.\n" +
            'Pro Tip: mentioning the bot with "reset prefix" will reset it to his default prefix.'
    },
    cooldown: 5000,
    perms: ['Administrator', 'ManageMessages'],
    type: 'Settings'
}