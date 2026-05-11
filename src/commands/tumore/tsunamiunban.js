module.exports = {
    name: ['tsunamiunban'],
    args: [
        { name: "userId", required: true, specifarg: false, orig: "<userId>" },
        { name: "reason", required: false, specifarg: false, orig: "\"[reason]\"" },
    ],
    execute: async function (msg, args, opts) {
        let poopy = this
        let config = poopy.config
        let vars = poopy.vars
        let { axios } = poopy.modules
        let { parseNumber } = poopy.functions

        if (!config.tumoreTesters.includes(msg.author.id)) {
            await msg.reply('Hey, you can\'t use this command! How unfortunate.').catch(() => { })
            return
        }

        if (opts.sourceMsg && msg.author.id != opts.sourceMsg.author.id) {
            await msg.reply("bro").catch(() => { })
            return
        }

        var userIdRaw = args[1]
        if (!userIdRaw) {
            await msg.reply('You gotta specify the user ID!').catch(() => { })
            return
        }

        var userId = parseNumber(userIdRaw, { min: 1, round: true })
        if (!userId) {
            await msg.reply('That user ID isn\'t valid.').catch(() => { })
            return
        }

        var saidMessage = args.slice(2).join(' ').replace(/’/g, '\'')
        vars.symbolreplacements.forEach(symbolReplacement => {
            symbolReplacement.target.forEach(target => {
                saidMessage = saidMessage.replace(new RegExp(target, 'ig'), symbolReplacement.replacement)
            })
        })

        var reason = (saidMessage.match(/^"([\s\S]*?)"/) ?? [])[1]
        if (reason) {
            reason = reason.replace(/\\(?=")/g, "")
            saidMessage = saidMessage.replace(`"${reason}"`, "").trim()
        }

        var res = await axios.post(`https://apis.roblox.com/messaging-service/v1/universes/9857818180/topics/${process.env.TSUNAMI_TOPIC}`, {
            message: JSON.stringify({
                Topic: "Unban",
                Inquery: {
                    PlayerId: Number(userId),
                    Reason: reason
                }
            })
        }, {
            headers: {
                "x-api-key": process.env.TSUNAMI_ROBLOX_KEY,
                "content-type": "application/json"
            }
        }).catch(() => { })

        if (!res) {
            await msg.reply('Unban request failed.').catch(() => { })
            return
        }

        await msg.reply('Unban request sent. They\'ll be undamned soon.').catch(() => { })
        return 'Unban request sent. They\'ll be undamned soon.'
    },
    help: {
        name: 'tsunamiunban <userId> "[reason]"',
        value: 'Unban someone.'
    },
    type: 'Tumore',
    envRequired: ['TSUNAMI_ROBLOX_KEY']
}
