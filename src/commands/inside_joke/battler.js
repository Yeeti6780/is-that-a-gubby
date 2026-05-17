module.exports = {
    name: ['battler', 'battlebricks', 'tbb'],
    args: [{
        name: "type",
        required: false,
        specifarg: false,
        orig: "[type]",
        autocomplete: function () {
            return [
                { name: "Friendlies", value: "friendly" },
                { name: "Enemies", value: "enemy" }
            ]
        }
    }],
    execute: async function (msg, args, opts) {
        let poopy = this
        let data = poopy.data
        let config = poopy.config
        let { DiscordTypes } = poopy.modules
        let { yesno } = poopy.functions

        args[1] = args[1] ?? ' '

        if (!(
            msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageGuild) ||
            msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageWebhooks) ||
            msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageMessages) ||
            msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) ||
            msg.author.id === msg.guild.ownerId || config.ownerids.find(id => id == msg.author.id) ||
            opts.isBot
        )) {
            await msg.reply('You need to have the manage webhooks/messages permission to execute that!').catch(() => { })
            return
        }

        if (!data.userData[msg.author.id].dangerousExecuted.includes("battler") && !msg.nosend && !opts.isBot && !data.guildData[msg.guild.id].ignoreDangerous) {
            var confirm = await yesno(msg.channel, "# Are you sure?\n"
                + "okay, so there is a chance you might be executing this command because someone told you to do it "
                + "and you have no idea what it does, basically it'll turn everyone in the current channel into a webhook "
                + "of a tbb (the battle bricks) unit depending on the nickname they have, which might be a little disastrous "
                + "depending on how active this channel is...\n"
                + "-# (a server admin can disable these confirmation prompts for the current server entirely with `p:ignoredanger`)", msg.member, undefined, msg).catch(() => { })
            if (!confirm) return

            data.userData[msg.author.id].dangerousExecuted.push("battler")
        }

        if (!data.guildData[msg.guild.id].channels[msg.channel.id].battling) {
            var battleValue = args[1] ? args[1].toLowerCase() : "battler"

            if (battleValue == "friendly" || battleValue == "friendlies" || battleValue == "1") battleValue = 1
            else if (battleValue == "enemy" || battleValue == "enemies" || battleValue == "2") battleValue = 2
            else battleValue = 3

            data.guildData[msg.guild.id].channels[msg.channel.id].battling = battleValue

            if (!msg.nosend) await msg.reply("https://static.wikia.nocookie.net/the-battle-bricks/images/0/03/TBB_current_logo.png").catch(() => { })
            return "https://static.wikia.nocookie.net/the-battle-bricks/images/0/03/TBB_current_logo.png"
        } else {
            data.guildData[msg.guild.id].channels[msg.channel.id].battling = 0

            if (!msg.nosend) await msg.reply("The Battle Bricks have died.").catch(() => { })
            return "The Battle Bricks have died."
        }
    },
    help: {
        name: 'battler/battlebricks/tbb [type (friendly or enemy)] (manage webhooks/messages permission only)',
        value: "I'm Battler, and I'm always battling! Many of the unofficial renders were made by GamerVenata!"
    },
    cooldown: 2500,
    perms: [
        'Administrator',
        'ManageMessages',
        'ManageWebhooks',
        'ManageGuild'
    ],
    type: 'Inside Joke'
}
