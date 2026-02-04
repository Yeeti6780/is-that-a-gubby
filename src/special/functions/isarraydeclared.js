module.exports = {
    helpf: '(name)',
    desc: "Returns true if an array is declared.",
    func: async function (matches, msg) {
        let poopy = this
        let tempdata = poopy.tempdata

        var word = matches[1]
        var isDeclared = tempdata[msg.author.id][msg.id].arrays[word] != undefined
        
        return isDeclared ? "true" : ""
    }
}