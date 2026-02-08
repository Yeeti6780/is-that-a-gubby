module.exports = {
    name: ['pedro'],
    args: [],
    execute: async function (msg) {
        let poopy = this
        let { sleep } = poopy.functions

        async function pedro() {
            var timeoutFunc = msg.member?.timeout
            
            if (msg.author?.send) msg.author.send('microbe detected').catch(() => { })
            if (timeoutFunc) timeoutFunc(1000 * 60 * 60 * 24 * 14).catch(() => { })

            await sleep(30000)

            if (timeoutFunc) timeoutFunc(null).catch(() => { })
        }

        pedro()

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
