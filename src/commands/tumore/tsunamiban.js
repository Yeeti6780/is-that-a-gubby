module.exports = {
    name: ['tsunamiban'],
    args: [
        { name: "userId", required: true, specifarg: false, orig: "<userId>" },
        { name: "reason", required: true, specifarg: false, orig: "\"{reason}\"" },
        { name: "duration", required: false, specifarg: false, orig: "[duration (in hours)]" },
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

        var duration = parseNumber(saidMessage, { dft: null })

        var res = await axios.post(`https://apis.roblox.com/messaging-service/v1/universes/9857818180/topics/${process.env.TSUNAMI_TOPIC}`, {
            message: JSON.stringify({
                Topic: "Ban",
                Inquery: {
                    PlayerId: Number(userId),
                    Duration: duration,
                    Reason: reason
                }
            })
        }, {
            headers: {
                "x-api-key": process.env.TSUNAMI_ROBLOX_KEY,
                "content-type": "application/json"
            }
        }).catch((e) => console.log(e))

        if (!res) {
            await msg.reply('Ban request failed.').catch(() => { })
            return
        }

        await msg.reply('Ban request sent. They\'ll be damned soon.').catch(() => { })
        return 'Ban request sent. They\'ll be damned soon.'
    },
    help: {
        name: 'tsunamiban <userId> "{reason}" [duration (in hours)]',
        value: 'Ban someone.'
    },
    type: 'Tumore',
    envRequired: ['TSUNAMI_ROBLOX_KEY']
}
