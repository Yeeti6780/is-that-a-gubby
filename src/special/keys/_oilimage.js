module.exports = {
  desc: 'oil image',
  func: function (msg) {
    let poopy = this
    let arrays = poopy.arrays
    let config = poopy.config
    let globaldata = poopy.globaldata

    var oilFolder = arrays.shitting
    if (process.env.SECRET_TRIGGER && config.tumoreTesters.includes(msg.author.id) && msg.guildId == process.env.SECRET_TRIGGER) {
      oilFolder = oilFolder.concat(globaldata.secretShit ?? [])
    }

    var shitting = oilFolder.filter(file => file.match(/\.(png|jpe?g|bmp|tiff|webp)/))

    return shitting[Math.floor(Math.random() * shitting.length)]
  },
  array: function (msg) {
    let poopy = this
    let arrays = poopy.arrays
    let config = poopy.config
    let globaldata = poopy.globaldata

    var oilFolder = arrays.shitting
    if (process.env.SECRET_TRIGGER && config.tumoreTesters.includes(msg.author.id) && msg.guildId == process.env.SECRET_TRIGGER) {
      oilFolder = oilFolder.concat(globaldata.secretShit ?? [])
    }

    return oilFolder.filter(file => file.match(/\.(png|jpe?g|bmp|tiff|webp)/))
  },
  cmdconnected: 'oil'
}
