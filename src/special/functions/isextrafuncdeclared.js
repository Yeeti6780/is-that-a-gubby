module.exports = {
    helpf: '(name)',
    desc: "Returns true if an extra function is declared.",
    func: async function (matches, msg, _, _, opts) {
        let poopy = this
        let tempdata = poopy.tempdata

        var word = matches[1]
        var isDeclared = opts.extraFuncs[word] != undefined
        
        return isDeclared ? "true" : ""
    },
    raw: true
}
