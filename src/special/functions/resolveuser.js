module.exports = {
    helpf: '(user)',
    desc: 'Returns the ID that corresponds to the resolved user if it exists.',
    func: async function (matches, msg) {
        let poopy = this
        let { resolveUser } = poopy.functions

        var word = matches[1]

        var resolvedUser = await resolveUser(word, msg.guild, "user").catch(() => { })

        return resolvedUser?.id ?? ""
    }
}
