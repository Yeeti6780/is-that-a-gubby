module.exports = {
    name: ['togglepings', 'togglementions'],
    args: [
        {
            "name": "users",
            "required": false,
            "specifarg": true,
            "orig": "[-users]"
        },
        {
            "name": "roles",
            "required": false,
            "specifarg": true,
            "orig": "[-roles]"
        },
        {
            "name": "everyone",
            "required": false,
            "specifarg": true,
            "orig": "[-everyone]"
        }
    ],
    execute: async function (msg, args) {
        let poopy = this
        let data = poopy.data
        let { fetchPingPerms, getOption } = poopy.functions

        var allowedMentionTypes = {
            users: !!getOption(args, 'users', { dft: false, splice: true, n: 0, join: true }),
            roles: !!getOption(args, 'roles', { dft: false, splice: true, n: 0, join: true }),
            everyone: !!getOption(args, 'everyone', { dft: false, splice: true, n: 0, join: true }),
        }

        var allowedMentions = Object.entries(allowedMentionTypes)
            .map(([mentionType, mentionEnabled]) => mentionEnabled ? mentionType : undefined)
            .filter(Boolean)

        data.userData[msg.author.id].allowedMentions = allowedMentions

        var mentionInfo = `✅ Allowed mention settings have been updated.\n${
            Object.entries(allowedMentionTypes)
            .map(([mentionType, mentionEnabled]) => `- *${mentionType.toCapperCase()}*: **${mentionEnabled}**`)
            .join("\n")
        }${allowedMentions.length ? "\n-# (remember to disable these later with `p:togglepings` alone, or... well, you might accidentally ping everyone!)" : ""}`

        msg.author.send(mentionInfo).catch(() => { })
        if (!msg.nosend) await msg.reply({
            content: mentionInfo,
            allowedMentions: fetchPingPerms(msg)
        }).catch((e) => console.log(e))
        return mentionInfo
    },
    help: {
        name: 'togglepings/togglementions [-users] [-roles] [-everyone]',
        value: "Toggles the bot's ability to ping certain users and roles when you have permissions in the current server to do so."
    },
    cooldown: 2500,
    type: 'Settings'
}