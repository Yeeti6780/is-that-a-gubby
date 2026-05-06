module.exports = {
    helpf: '(phrase)',
    desc: 'The markov chain generated AND THE Last Messages. turn on',
    func: function (matches, msg) {
        let poopy = this
        let tempdata = poopy.tempdata
        let json = poopy.json
        let arrays = poopy.arrays
        let { markovChainGenerator, markovMe } = poopy.functions

        var word = matches[1]

        var messages = tempdata[msg.guild.id].messages.map(m => m.content)
        if (messages.length <= 0) {
            messages = json.sentenceJSON.data.map(s => s.sentence)
        }
        if (word) {
            messages.push(word)
        }
        var markovChain = markovChainGenerator(messages)
        var markov = markovMe(markovChain, word)

        return markov
    },
    cmdconnected: 'oldmarkov'
}
