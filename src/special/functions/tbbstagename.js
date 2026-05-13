module.exports = {
    helpf: '(order | chapter)',
    desc: 'Returns the name of the TBB stage according to its chapter or global order.',
    func: function (matches) {
        let poopy = this
        let json = poopy.json
        let { splitKeyFunc, parseNumber } = poopy.functions

        var [order, chapter] = splitKeyFunc(matches[1], { args: 2 })
        if (!order) return ""

        var chapters = Object.entries({ ...json.stageJSON.main, ...json.stageJSON.sub })
        var [_, stages] = chapters.find(([ch]) => ch == chapter) ?? []
        if (!chapter || !stages) stages = chapters.map(([_, st]) => st).flat()

        order = parseNumber(order, { dft: 1, min: 1, max: stages.length, round: true })

        return stages[order - 1].name
    }
}
