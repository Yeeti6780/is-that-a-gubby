module.exports = {
    name: ['poop'],
    args: [],
    execute: async function (msg) {
        let poopy = this
        let arrays = poopy.arrays
        let { fetchPingPerms } = poopy.functions

        msg.channel.sendTyping().catch(() => { })
        var poop = arrays.poopPhrases[Math.floor(Math.random() * arrays.poopPhrases.length)]
            .replace(/{fart}/g, Math.floor(Math.random() * 291) + 10)
            .replace(/{seconds}/g, Math.floor((Math.random() * 59) + 2))
            .replace(/{mention}/g, `<@${msg.author.id}>`)
        if (!msg.nosend) await msg.reply({
            content: poop,
            allowedMentions: fetchPingPerms(msg)
        }).catch(() => { })
        return poop
    },
    help: { name: 'poop', value: 'The bot says a random funny.' },
    type: 'OG'
}