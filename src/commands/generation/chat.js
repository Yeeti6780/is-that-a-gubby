module.exports = {
    name: ['chat', 'ask'],
    args: [
        {
            "name": "message", "required": true, "specifarg": false, "orig": "<message>"
        },
        {
            "name": "temperature", "required": false, "specifarg": true, "orig": "[-temperature <number (from 0 to 1)>]"
        },
        {
            "name": "instruct", "required": false, "specifarg": true, "orig": "[-instruct <prompt>]"
        },
        {
            "name": "clear", "required": false, "specifarg": true, "orig": "[-clear]"
        }
    ],
    execute: async function (msg, args) {
        let poopy = this
        let { tempdata } = poopy
        let { getOption, parseNumber, chat, fetchPingPerms } = poopy.functions
        let { axios, fs, Discord } = poopy.modules
        let vars = poopy.vars
        let config = poopy.config

        await msg.channel.sendTyping().catch(() => { })

        var temperature = getOption(args, 'temperature', { dft: 1, splice: true, n: 1, join: true, func: (opt) => parseNumber(opt, { dft: 1, min: 0, max: 1, round: false }) })
        var instruct = getOption(args, 'instruct', { dft: vars.chatInstruct, splice: true, n: Infinity, join: true, stopMatch: ["-clear", "-temperature"] })
        var clear = getOption(args, 'clear', { n: 0, splice: true, dft: false })

        var saidMessage = args.slice(1).join(' ')
        if (args[1] === undefined) {
            await msg.reply('What is the message to send?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return
        }

        var chatResponse = await chat(saidMessage, msg, {
            temperature, instruct, clear,
            useTools: true
        }).catch((e) => console.log(e)) ?? "what"

        if (!msg.nosend) await msg.reply({
            content: chatResponse,
            allowedMentions: fetchPingPerms(msg)
        }).catch(async () => {
            var currentcount = vars.filecount
            vars.filecount++
            var filepath = `temp/${config.database}/file${currentcount}`
            fs.mkdirSync(`${filepath}`)
            fs.writeFileSync(`${filepath}/generated.txt`, chatResponse)
            await msg.reply({
                files: [new Discord.AttachmentBuilder(`${filepath}/generated.txt`)]
            }).catch(() => { })
            fs.rmSync(`${filepath}`, { force: true, recursive: true })
        })
        return chatResponse
    },
    help: {
        name: 'chat/ask <message> [-temperature <number (from 0 to 1)>] [-instruct <prompt>] [-clear]',
        value: 'Generates an answer based on your prompt using AI21. Default temperature is 1.'
    },
    type: 'Generation',
    envRequired: ['AI21_KEY']
}
