module.exports = {
    helpf: '(begin | maxLength)',
    desc: 'The markov chain generated AND THE Last Messages. uses genai algorithm!',
    func: function (matches, msg) {
        let poopy = this
        let tempdata = poopy.tempdata
        let json = poopy.json
        let arrays = poopy.arrays
        let { genAi, splitKeyFunc, parseNumber } = poopy.functions

        var word = matches[1]
        var [begin, maxLength] = splitKeyFunc(word, { args: 2 })

        var messages = tempdata[msg.guild.id].messages.map(m => m.content)
        if (messages.length <= 0) {
            messages = json.sentenceJSON.data.map(s => s.sentence)
        }
        if (begin) {
            messages.push(begin)
        }

        return genAi.generate(messages, {
            begin: begin,
            maxLength: parseNumber(maxLength ?? '', { dft: Math.floor(Math.random() * 295) + 5, min: 1, max: 2000, round: true })
        })
    },
    cmdconnected: 'genai'
}