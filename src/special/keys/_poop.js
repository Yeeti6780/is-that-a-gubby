module.exports = {
    desc: 'Returns a random Poopy funny.',
    func: function (msg) {
        let poopy = this
        let arrays = poopy.arrays

        return arrays.poopPhrases[Math.floor(Math.random() * arrays.poopPhrases.length)]
            .replace(/{fart}/g, Math.floor(Math.random() * 291) + 10)
            .replace(/{seconds}/g, Math.floor((Math.random() * 59) + 2))
            .replace(/{mention}/g, `<@${msg.author.id}>`)
    },
    array: function (msg) {
        let poopy = this
        let arrays = poopy.arrays

        return arrays.poopPhrases.map(poop => poop
            .replace(/{fart}/g, Math.floor(Math.random() * 291) + 10)
            .replace(/{seconds}/g, Math.floor((Math.random() * 59) + 2))
            .replace(/{mention}/g, `<@${msg.author.id}>`)
        )
    },
    cmdconnected: 'poop'
}