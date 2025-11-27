module.exports = {
    helpf: '(randomSentences)',
    desc: 'The markov chain generated AND THE Last Messages. uses diffrent algorithm!',
    func: function (matches, msg) {
        let poopy = this
        let tempdata = poopy.tempdata
        let json = poopy.json
        let arrays = poopy.arrays
        let { markov } = poopy.functions

        var word = matches[1]

        var messages = tempdata[msg.guild.id].messages.map(m => m.content)
        if (messages.length <= 0 || word) {
            messages = json.sentenceJSON.data.map(s => s.sentence)
        }

        return markov(messages)
    },
    cmdconnected: 'markov2'
}