module.exports = {
    name: ['markov', 'genai'],
    args: [
        { "name": "begin", "required": false, "specifarg": false, "orig": "[begin]" },
        { "name": "minlength", "required": false, "specifarg": true, "orig": "[-minlength <charNumber (1 to 10000)>]" },
        { "name": "maxlength", "required": false, "specifarg": true, "orig": "[-maxlength <charNumber (1 to 10000)>]" },
        { "name": "randomsentences", "required": false, "specifarg": true, "orig": "[-randomsentences]" }
    ],
    execute: async function (msg, args) {
        let poopy = this
        let { getOption, parseNumber, workerTask, genAi, fetchPingPerms } = poopy.functions
        let tempdata = poopy.tempdata
        let json = poopy.json
        let arrays = poopy.arrays
        let vars = poopy.vars
        let config = poopy.config
        let { fs, Discord } = poopy.modules

        var minLength = getOption(args, 'minlength', { dft: 1, splice: true, n: 1, join: true, func: (opt) => parseNumber(opt, { dft: 1, min: 1, max: 10000, round: true }) })
        var maxLength = getOption(args, 'maxlength', { dft: Math.floor(Math.random() * 290) + 10, splice: true, n: 1, join: true, func: (opt) => parseNumber(opt, { dft: Math.floor(Math.random() * 290) + 10, min: 1, max: 10000, round: true }) })
        var randomsentences = getOption(args, 'randomsentences', { dft: false, splice: true, n: 0, join: true })

        var saidMessage = args.join(' ').substring((args[0] || '').length + 1)
        var messages = tempdata[msg.guild.id].messages.map(m => m.content)
        if (messages.length <= 0 || randomsentences) {
            messages = json.sentenceJSON.data.map(s => s.sentence)
        }
        if (saidMessage) {
            messages.push(saidMessage)
        }

        await msg.channel.sendTyping().catch(() => { })

        if (!tempdata[msg.guild.id].messageModel) {
            tempdata[msg.guild.id].messageModel = workerTask("genai-model", messages)
        }
    
        if (tempdata[msg.guild.id].messageModel instanceof Promise) {
            tempdata[msg.guild.id].messageModel = await tempdata[msg.guild.id].messageModel
        }

        var [markovString] = genAi.generateFromModel(tempdata[msg.guild.id].messageModel, {
            minLength: minlength,
            maxLength: maxLength,
            begin: saidMessage
        })

        if (!msg.nosend) await msg.reply({
            content: markovString,
            allowedMentions: fetchPingPerms(msg)
        }).catch(async () => {
            var currentcount = vars.filecount
            vars.filecount++
            var filepath = `temp/${config.database}/file${currentcount}`
            fs.mkdirSync(`${filepath}`)
            fs.writeFileSync(`${filepath}/markov.txt`, markovString)
            await msg.reply({
                files: [new Discord.AttachmentBuilder(`${filepath}/markov.txt`)]
            }).catch(() => { })
            fs.rmSync(`${filepath}`, { force: true, recursive: true })
        })
        return markovString
    },
    help: {
        name: 'markov/genai [begin] [-minlength <charNumber (1 to 10000)>] [-maxlength <charNumber (1 to 10000)>] [-randomsentences]',
        value: 'the Poopy Markov includes last messages. TOGGLE the Message reading with p:messages to Function. this use GenAi Discord Bot Algorithm......'
    },
    cooldown: 2500,
    type: 'Text'
}