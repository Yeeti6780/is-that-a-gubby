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
                var findChapterMethods = [
                    s => s.name.toLowerCase() == stage.toLowerCase().trim(),
                    s => s.name.toLowerCase().includes(stage.toLowerCase().trim()),
                    s => s.name.toLowerCase().replace(/[^a-z0-9]/g, "").includes(stage.toLowerCase().replace(/[^a-z0-9]/g, "").trim())
                ]

                for (var find of findChapterMethods) {
                    var found = stages.findIndex(find)
                    if (found > 0) {
                        findStage = found
                        return true
                    }
                }

                return false
            }
        )

        return findStage != undefined ? findStage + 1 : ""
    }
}
