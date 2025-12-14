module.exports = {
    name: ['bludfraud', 'bluddistrust'],
    args: [{ "name": "userId", "required": true, "specifarg": false, "orig": "<userId>" }],
    execute: async function (msg, args) {
        let poopy = this
        let config = poopy.config
        let { axios } = poopy.modules
        let { parseNumber } = poopy.functions

        if (!config.tumoreTesters.includes(msg.author.id)) {
            await msg.reply('Hey, you can\'t use this command! How unfortunate.').catch(() => { })
            return
        }

        var userIdRaw = args.slice(1).join(' ').trim()
        if (!userIdRaw) {
            await msg.reply('You gotta specify the user ID!').catch(() => { })
            return
        }

        var userId = parseNumber(userIdRaw, { min: 1, round: true })
        if (!userId) {
            await msg.reply('That user ID isn\'t valid.').catch(() => { })
            return
        }

        var res = await axios.post(`https://apis.roblox.com/messaging-service/v1/universes/7091645916/topics/${process.env.BLUD_TOPIC}`, {
            message: JSON.stringify({
                Topic: "Fraud",
                Inquery: { PlayerId: Number(userId), Value: true }
            })
        }, {
            headers: {
                "x-api-key": process.env.BLUD_ROBLOX_KEY,
                "content-type": "application/json"
            }
        }).catch(() => { })

        if (!res) {
            await msg.reply('Fraud request failed.').catch(() => { })
            return
        }

        await msg.reply('Fraud request sent. They\'ll be distrusted soon.').catch(() => { })
        return 'Fraud request sent. They\'ll be distrusted soon.'
    },
    help: {
        name: 'bludfraud/bluddistrust <userId>',
        value: 'Distrust someone.'
    },
    type: 'Owner'
}
