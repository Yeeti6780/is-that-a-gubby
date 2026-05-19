module.exports = {
    helpf: '(url)',
    desc: 'Uploads the provided URL to a file hosting service.',
    func: async function (matches) {
        let poopy = this
        let { validateFile } = poopy.functions
        let { HTTPClientUtils } = poopy.modules
        let vars = poopy.vars

        var url = matches[1]
        
        var fileinfo = await validateFile(url, 'very true', { noPathsAllowed: true }).catch(() => { })
        if (!fileinfo) return ''

        var fileLink = await HTTPClientUtils.uploadToFileHost(fileinfo.path).catch(() => { }) ?? ''

        return vars.validUrl.test(fileLink) ? fileLink : ''
    },
    attemptvalue: 5
}
