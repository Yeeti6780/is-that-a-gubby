module.exports = {
    helpf: '(stage | global)',
    desc: 'Returns the order of the TBB stage according to its chapter or globally.',
    func: function (matches) {
        let poopy = this
        let json = poopy.json
        let { splitKeyFunc } = poopy.functions

        var [stage, global] = splitKeyFunc(matches[1], { args: 2 })

        var chapters = Object.values({ ...json.stageJSON.main, ...json.stageJSON.sub })
        if (global) chapters = [[chapters.flat()]]

        var findChapter = chapters.find(
            (stages) => stages.some(
                s => s.name.toLowerCase().includes(stage.toLowerCase().trim())
            )
        )

        return findChapter ? findChapter.findIndex(
            s => s.name.toLowerCase() == stage.toLowerCase().trim()
        ) + 1 : ""
    }
}
