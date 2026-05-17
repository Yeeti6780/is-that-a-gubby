module.exports = {
  helpf: '(url)',
  desc: 'Fetches the short extension of the specified file (png/gif/mp4/mp3/...).',
  func: async function (matches) {
    let poopy = this
    let { validateFile } = poopy.functions

    var word = matches[1]

    var error
    var fileinfo = await validateFile(word, 'very true', { noPathsAllowed: true }).catch(err => {
      error = err
    })
    if (error) return error

    return fileinfo.shortext
  }
}