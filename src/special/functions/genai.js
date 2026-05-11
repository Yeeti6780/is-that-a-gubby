module.exports = {
    helpf: '(begin | minLength | maxLength)',
    desc: 'The markov chain generated AND THE Last Messages. uses genai algorithm!',
    func: async function (matches, msg) {
        let poopy = this
        let tempdata = poopy.tempdata
        let json = poopy.json
        let arrays = poopy.arrays
        let { workerTask, splitKeyFunc, parseNumber, genAi } = poopy.functions
        let { GenAIWorker } = poopy.modules

        var word = matches[1]

        var randomLengthPicked = false
        function pickRandomLength() {
            randomLengthPicked = true
            return Math.floor(Math.random() * 290) + 10
        }

        var [begin, minLength, maxLength] = splitKeyFunc(word, { args: 2 })
        minLength = parseNumber(minLength, { dft: 1, min: 1, max: 10000, round: true })
        maxLength = parseNumber(maxLength, { dft: pickRandomLength, min: 1, max: 10000, round: true })

        var messages = tempdata[msg.guild.id].messages.map(m => m.content)
        if (messages.length <= 0) {
            messages = json.sentenceJSON.data.map(s => s.sentence)
        }

        if (randomLengthPicked && (begin || minLength != 1)) maxLength = Math.max(maxLength, 300, minLength)

        if (!tempdata[msg.guild.id].messageModel) {
            tempdata[msg.guild.id].messageModel = new GenAIWorker(
                tempdata[msg.guild.id].messages.map(m => m.content)
            )
        }

        const modelWorker = tempdata[msg.guild.id].messageModel

        var [markovString] = await modelWorker.generate({
            minLength: minLength,
            maxLength: maxLength,
            begin: begin
        })

        return markovString
    },
    cmdconnected: 'genai'
}
