module.exports = {
    helpf: '(name)',
    desc: "Returns true if a variable is declared.",
    func: async function (matches, msg) {
        let poopy = this
        let tempdata = poopy.tempdata

        var word = matches[1]
        var isDeclared = tempdata[msg.author.id][msg.id].keyDeclared[`{${word}}`] != undefined
        
        return isDeclared ? "true" : ""
    }
}