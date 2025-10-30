module.exports = {
    desc: 'Returns a random color name.',
    func: function () {
        let poopy = this
        let json = poopy.json

        var colorJSON = json.colorJSON
        return colorJSON[Math.floor(Math.random() * colorJSON.length)].name
    },
    array: function () {
        let poopy = this
        let json = poopy.json

        var colorJSON = json.colorJSON
        return colorJSON.map(c => c.name)
    }
}