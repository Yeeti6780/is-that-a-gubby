module.exports = {
    helpf: '(name)',
    desc: "Undeclares a variable in case it exists.",
    func: async function (matches, msg) {
        let poopy = this
        let tempdata = poopy.tempdata

        var word = matches[1]

        delete tempdata[msg.author.id][msg.id].declared[`{${word}}`]
        delete tempdata[msg.author.id][msg.id].keyDeclared[`{${word}}`]
        
        return ""
    }
}