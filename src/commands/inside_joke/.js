module.exports = {
    name: [''],
    args: [],
    execute: async function (msg, args) {
        let poopy = this
        let { chat, randomChoice, fetchPingPerms } = poopy.functions
        let arrays = poopy.arrays
        
        if (process.env.AI21_KEY && args.length > 1) {
            var saidMessage = args.slice(1).join(' ')

            var chatResponse = await chat(saidMessage, msg, {
                errorMsg: randomChoice(arrays.eightball)
            }).catch(() => { }) ?? "what"
            
            if (!msg.nosend) await msg.reply({
                content: chatResponse,
                allowedMentions: {
                    parse: fetchPingPerms(msg)
                }
            }).catch(() => { })
            
            return chatResponse
        }
        
        if (!msg.nosend) await msg.reply("crimes").catch(() => { })
        return "crimes"
    },
    help: {
        name: '',
        value: 'crimes'
    },
    cooldown: 2500,
    type: 'Inside Joke'
}
