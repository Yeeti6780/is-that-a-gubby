module.exports = {
    name: ['chew'],
    args: [{ name: "image", required: true, specifarg: false, orig: "<image>" }],
    execute: async function (msg, args) {
        let poopy = this
        let { lastUrl, validateFile, downloadFile, execPromise, findpreset, sendFile, fetchPingPerms } = poopy.functions
        let { fs } = poopy.modules
        let vars = poopy.vars

        msg.channel.sendTyping().catch(() => { })
        if (lastUrl(msg, 0) === undefined && args[1] === undefined) {
            await msg.reply('What is the file?!').catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = lastUrl(msg, 0) || args[1]
        var chewnumber = 15 // Math.floor(Math.random() * 11) + 20

        var fileinfo = await validateFile(currenturl).catch(async error => {
            await msg.reply({
                content: error,
                allowedMentions: fetchPingPerms(msg)
            }).catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return;
        })

        if (!fileinfo) return
        var type = fileinfo.type

        var chewFilters = []
        var currentStream = "[0:v]"

        if (type.mime.startsWith('image') || type.mime.startsWith('video')) {
            var width = fileinfo.info.width
            var height = fileinfo.info.height

            for (var i = 0; i < chewnumber; i++) {
                var maskpos = { x: Math.floor(Math.random() * 101) / 100, y: Math.floor(Math.random() * 101) / 100 }
                var masksize = { x: Math.floor(Math.random() * 9) + 2, y: Math.floor(Math.random() * 9) + 2 }
                var maskangle = Math.floor(Math.random() * 361) - 180
                var chewoffset = { x: Math.floor(Math.random() * 61) - 30, y: Math.floor(Math.random() * 61) - 30 }
                var repetitions = 1 //Math.floor(Math.random() * 9) + 1

                var origoffset = { ...chewoffset }

                for (var j = 0; j < repetitions; j++) {
                    var chewid = `${i}_${j}`

                    var lastStream = currentStream
                    var newStream = (i < chewnumber - 1 || j < repetitions - 1) ? `[chewed${chewid}]` : ``

                    var chewFilter = `[1:v]scale=${Math.round(width / masksize.x)}:${Math.round(height / masksize.y)},rotate=${maskangle.toFixed(2)}*PI/180:ow=rotw(${maskangle.toFixed(2)}*PI/180):oh=roth(${maskangle.toFixed(2)}*PI/180)[chewmask${chewid}];` +
                        `[2:v]scale=${width}:${height}[chewbg${chewid}];[chewbg${chewid}][chewmask${chewid}]overlay=x=W*${maskpos.x.toFixed(2)}-w/2:y=H*${maskpos.y.toFixed(2)}-h/2:format=auto[chewbgmask${chewid}];` +
                        `[0:v][chewbgmask${chewid}]alphamerge[chew${chewid}];${lastStream}[chew${chewid}]overlay=x=${chewoffset.x.toFixed(2)}-W/250:y=${chewoffset.y.toFixed(2)}-H/250:format=auto${newStream}`
                    
                    chewFilters.push(chewFilter)

                    currentStream = newStream

                    chewoffset.x += (origoffset.x * (width / 250)) * repetitions
                    chewoffset.y += (origoffset.y * (height / 250)) * repetitions
                }
            }

            if (type.mime.startsWith('image') && !(vars.gifFormats.find(f => f === type.ext))) {
                var filepath = await downloadFile(currenturl, `input.png`, { fileinfo })
                var filename = `input.png`

                fs.writeFileSync(`${filepath}/chewfilter.txt`, `${chewFilters.join(";")}[out]`)

                await execPromise(`ffmpeg -i ${filepath}/${filename} -i assets/image/chewmask.png -i assets/image/black.png ` +
                `-filter_complex_script ${filepath}/chewfilter.txt -map "[out]" -preset ${findpreset(args)} ${filepath}/output.png`)
                return await sendFile(msg, filepath, `output.png`)
            } else if (type.mime.startsWith('video')) {
                var filepath = await downloadFile(currenturl, `input.mp4`, { fileinfo })
                var filename = `input.mp4`

                fs.writeFileSync(`${filepath}/chewfilter.txt`, `${chewFilters.join(";")}[out]`)

                await execPromise(`ffmpeg -i ${filepath}/${filename} -i assets/image/chewmask.png -i assets/image/black.png -map 0:a? ` +
                `-filter_complex_script ${filepath}/chewfilter.txt -map "[out]" -preset ${findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)
                return await sendFile(msg, filepath, `output.mp4`)
            } else if (type.mime.startsWith('image') && vars.gifFormats.find(f => f === type.ext)) {
                var filepath = await downloadFile(currenturl, `input.gif`, { fileinfo })
                var filename = `input.gif`

                fs.writeFileSync(`${filepath}/chewfilter.txt`, `${chewFilters.join(";")},split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]`)

                await execPromise(`ffmpeg -i ${filepath}/${filename} -i assets/image/chewmask.png -i assets/image/black.png ` +
                `-filter_complex_script ${filepath}/chewfilter.txt -map "[out]" -preset ${findpreset(args)} -gifflags -offsetting ${filepath}/output.gif`)
                return await sendFile(msg, filepath, `output.gif`)
            }
        } else {
            await msg.reply({
                content: `Unsupported file: \`${currenturl}\``,
                allowedMentions: fetchPingPerms(msg)
            }).catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return
        }
    },
    help: { name: 'chew <image>', value: 'Literally chews the image.' },
    cooldown: 2500,
    type: 'Effects'
}