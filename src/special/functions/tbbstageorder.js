module.exports = {
    helpf: '(stage | global)',
    desc: 'Returns the order of the TBB stage according to its chapter or globally.',
    func: function (matches) {
        let poopy = this
        let json = poopy.json
        let { splitKeyFunc } = poopy.functions

        var [stage, global] = splitKeyFunc(matches[1], { args: 2 })
        if (!stage) return ""

        var chapters = Object.values({ ...json.stageJSON.main, ...json.stageJSON.sub })
        if (global) chapters = [chapters.flat()]

        var findStage
        var findChapter = chapters.find(
            (stages) => {
                var findChapterStage = stages.findIndex(
                    s => s.name.toLowerCase() == stage.toLowerCase().trim()
                )
                if (findChapterStage < 0) findChapterStage = stages.findIndex(
                    s => s.name.toLowerCase().includes(stage.toLowerCase().trim())
                )
                
                if (findChapterStage >= 0) {
                    findStage = findChapterStage
                    return true
                }

                return false
            }
        )

        return findStage != undefined ? findStage + 1 : ""
    }
}
