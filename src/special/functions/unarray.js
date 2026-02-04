module.exports = {
    helpf: '(name)',
    desc: "Undeclares an array in case it exists.",
    func: async function (matches, msg) {
        let poopy = this
        let tempdata = poopy.tempdata

        var word = matches[1]

        delete tempdata[msg.author.id][msg.id].arrays[word]
        
        return ""
    }
}