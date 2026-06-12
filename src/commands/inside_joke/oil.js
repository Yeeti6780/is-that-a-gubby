module.exports = {
    name: ['oil'],
    args: [{
        name: "type", required: false, specifarg: true, orig: "[-type <extension (image/video/gif)>]", autocomplete: [
            'image',
            'video',
            'gif'
        ]
    }],
    execute: async function (msg, args) {
        let poopy = this
        let arrays = poopy.arrays
        let config = poopy.config
        let globaldata = poopy.globaldata

        var type = 'any'
        var typeindex = args.indexOf('-type')
        if (typeindex > -1) {
            type = String(args[typeindex + 1]).toLowerCase()
        }

        var oilFolder = arrays.shitting
        if (process.env.SECRET_TRIGGER && config.tumoreTesters.includes(msg.author.id)) {
            if (msg.guildId == process.env.SECRET_TRIGGER || args.includes(`-${process.env.SECRET_ARG}`)) {
                oilFolder = oilFolder.concat(globaldata.secretShit ?? [])
            }
        }

        var shitting = oilFolder.filter(file => {
            switch (type) {
                case 'image': return file.match(/\.(png|jpe?g|bmp|webp|tiff)/)

                case 'video': return file.match(/\.(mov|mp4|wmv|avi|webm)/)

                case 'gif': return file.match(/\.(gif|apng)/)

                default: return true
            }
        })

        var shit = shitting[Math.floor(Math.random() * shitting.length)]
        if (!msg.nosend) await msg.reply(shit).catch(() => { })
        return shit
    },
    help: {
        name: 'oil [-type <extension (image/video/gif)>]',
        value: 'oil folder'
    },
    cooldown: 2500,
    type: 'Inside Joke'
}
