module.exports = {
    name: ['pedro'],
    args: [],
    execute: async function (msg, _, opts) {
        let poopy = this
        let data = poopy.data
        let { sleep, yesno } = poopy.functions

        async function pedro() {
            if (msg.author?.send) msg.author.send('microbe detected').catch(() => { })
            if (msg.member?.timeout) msg.member.timeout(1000 * 60 * 60 * 24 * 14).catch(() => { })

            await sleep(30000)

            if (msg.member?.timeout) msg.member.timeout(null).catch(() => { })
        }

        if (!data.userData[msg.author.id].dangerousExecuted.includes("pedro") && !msg.nosend && !opts.isBot && !data.guildData[msg.guild.id].ignoreDangerous) {
            var confirm = await yesno(msg.channel, "# Are you sure?\n"
                + "okay, so there is a chance you might be executing this command because someone told you to do it "
                + "and you have no idea what it does, basically it'll give you a 14 day timeout (but then it gets removed from you after 30 seconds)...\n"
                + "-# (a server admin can disable this command by using `p:togglecmds pedro`, or disable these confirmation prompts for the current server entirely with `p:ignoredanger`)", msg.member, undefined, msg).catch(() => { })
            if (!confirm) return

            data.userData[msg.author.id].dangerousExecuted.push("pedro")
        }

        pedro().catch(() => { })

        if (!msg.nosend) await msg.reply("microbe detected").catch(() => { })
        return "microbe detected"
    },
    help: {
        name: 'pedro',
        value: 'microbe detected'
    },
    cooldown: 2500,
    type: 'Inside Joke'
}
