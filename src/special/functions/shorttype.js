module.exports = {
  helpf: '(url)',
  desc: 'Fetches the short type of the specified file (image/gif/video/audio/...).',
  func: async function (matches) {
    let poopy = this
    let { validateFile } = poopy.functions

    var word = matches[1]

    var error
    var fileinfo = await validateFile(word, 'very true', { noPathsAllowed: true }).catch(err => {
      error = err
    })
    if (error) return error

    return fileinfo.shorttype
  }
}