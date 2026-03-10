module.exports = {
    helpf: '(battler)',
    desc: 'Returns the normal form corresponding to the alt form TBB battler.',
    func: function (matches) {
        let poopy = this
        let json = poopy.json

        var battler = matches[1]

        var battlerData = [json.battlerJSON.battlers, json.battlerJSON.enemies]
        
        var battlers = battlerData.flat()

        var findBattler = battlers.find(b => b.name.toLowerCase() == battler.toLowerCase().trim())

        return findBattler ? findBattler.normal ?? findBattler.name : ""
    }
}