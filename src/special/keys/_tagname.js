module.exports = {
    desc: 'Returns your tag name.', func: function (msg) {
        let poopy = this

        return msg.author.tag
    }
}