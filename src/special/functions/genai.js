module.exports = {
    helpf: '(begin | minLength | maxLength)',
    desc: 'The markov chain generated AND THE Last Messages. uses genai algorithm!',
    func: async function (matches, msg) {
        let poopy = this
        let tempdata = poopy.tempdata
        let json = poopy.json
        let arrays = poopy.arrays
        let { workerTask, splitKeyFunc, parseNumber, genAi } = poopy.functions

        var word = matches[1]
        var [begin, minLength, maxLength] = splitKeyFunc(word, { args: 2 })
        minLength = parseNumber(minLength, { dft: 1, min: 1, max: 10000, round: true })
        maxLength = parseNumber(maxLength, { dft: Math.max(Math.floor(Math.random() * 290) + 10, minLength), min: 1, max: 10000, round: true })

        var messages = tempdata[msg.guild.id].messages.map(m => m.content)
        if (messages.length <= 0) {
            messages = json.sentenceJSON.data.map(s => s.sentence)
        }
        if (begin) {
            messages.push(begin)
        }

        if (!tempdata[msg.guild.id].messageModel) {
            tempdata[msg.guild.id].messageModel = workerTask("genai-model", messages)
        }
    
        if (tempdata[msg.guild.id].messageModel instanceof Promise) {
            tempdata[msg.guild.id].messageModel = await tempdata[msg.guild.id].messageModel
        }

        var [markovString] = genAi.generateFromModel(tempdata[msg.guild.id].messageModel, {
            minLength: minLength,
            maxLength: maxLength,
            begin: begin
        })

        return markovString
    },
    cmdconnected: 'genai'
}
