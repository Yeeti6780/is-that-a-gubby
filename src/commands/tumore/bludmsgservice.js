module.exports = {
    name: ['bludmsgservice', 'bludmessageservice'],
    args: [
        { name: "topic", required: true, specifarg: false, orig: "<topic>" },
        { name: "inquery", required: true, specifarg: false, orig: "{inquery}" },
    ],
    execute: async function (msg, args, opts) {
        let poopy = this
        let config = poopy.config
        let { axios } = poopy.modules
        let { tryJSONparse, parseNumber } = poopy.functions

        if (!config.tumoreTesters.includes(msg.author.id)) {
            await msg.reply('Hey, you can\'t use this command! How unfortunate.').catch(() => { })
            return
        }

        if (opts.sourceMsg && msg.author.id != opts.sourceMsg.author.id) {
            await msg.reply("bro").catch(() => { })
            return
        }

        var topic = args[1]
        if (!topic) {
            await msg.reply('You gotta specify the topic!').catch(() => { })
            return
        }

        var inQueryRaw = args.slice(2).join(' ').trim()
        var inQueryParsed = tryJSONparse(inQueryRaw)

        var inQuery = inQueryRaw ? (
            typeof inQueryParsed == "object" ? inQueryParsed :
            { PlayerId: parseNumber(inQueryRaw, { min: 1, round: true }) }
        ) : {}

        var res = await axios.post(`https://apis.roblox.com/messaging-service/v1/universes/7091645916/topics/${process.env.BLUD_TOPIC}`, {
            message: JSON.stringify({
                Topic: topic,
                Inquery: inQuery
            })
        }, {
            headers: {
                "x-api-key": process.env.BLUD_ROBLOX_KEY,
                "content-type": "application/json"
            }
        }).catch(() => { })

        if (!res) {
            await msg.reply('Messaging Service API request failed.').catch(() => { })
            return
        }

        await msg.reply('Messaging Service API request sent. Something sinister might happen soon...').catch(() => { })
        return 'Messaging Service API request sent. Something sinister might happen soon...'
    },
    help: {
        name: 'bludmsgservice/bludmessageservice <topic> {inQuery}',
        value: 'Send a request to Roblox\'s Messaging Service API.'
    },
    type: 'Tumore',
    envRequired: ['BLUD_ROBLOX_KEY']
}
