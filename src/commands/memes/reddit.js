module.exports = {
    name: ['reddit'],
    args: [{ "name": "name", "required": false, "specifarg": false, "orig": "{name}" }, { "name": "file", "required": false, "specifarg": false, "orig": "{file}" }],
    execute: async function (msg, args) {
        let poopy = this
        let {
            lastUrl, validateFile, downloadFile, execPromise,
            findpreset, sendFile, fetchPingPerms, cleanContentPreserveEmojis
        } = poopy.functions
        let vars = poopy.vars
        let { Jimp } = poopy.modules

        msg.channel.sendTyping().catch(() => { })
        if (lastUrl(msg, 0) === undefined && args[1] === undefined) {
            await msg.reply('What is the file?!').catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return;
        };
        var saidMessage = args.slice(1).join(' ')
        vars.symbolreplacements.forEach(symbolReplacement => {
            symbolReplacement.target.forEach(target => {
                saidMessage = saidMessage.replace(new RegExp(target, 'ig'), symbolReplacement.replacement)
            })
        })
        var matchedTextes = saidMessage.match(/"([\s\S]*?)"/)
        if (!matchedTextes) {
            matchedTextes = ['""', '']
        }
        var text = cleanContentPreserveEmojis(matchedTextes[1], msg.channel)
        var currenturl = lastUrl(msg, 0) || args[1]
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

        if (type.mime.startsWith('image') && !(vars.gifFormats.find(f => f === type.ext))) {
            var filepath = await downloadFile(currenturl, `input.png`, {
                fileinfo
            })
            var filename = `input.png`

            var reddittop = await Jimp.read(`assets/image/reddittop.png`)
            var redditbottom = await Jimp.read(`assets/image/redditbottom.png`)
            var ibm = await Jimp.loadFont(`assets/fonts/IBMPlexSans/IBMPlexSans.fnt`)
            await Jimp.print(reddittop, ibm, 18, 315, { text: text, alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT, alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE }, 364, 66)
            await reddittop.writeAsync(`${filepath}/top.png`)

            await execPromise(`ffmpeg -i ${filepath}/top.png -i ${filepath}/${filename} -i assets/image/redditbottom.png -filter_complex "[1:v]scale=${reddittop.bitmap.width}:-1[scaled];[0:v][scaled][2:v]vstack=inputs=3[out]" -map "[out]" -preset ${findpreset(args)} ${filepath}/reddit.png`)
            await execPromise(`ffmpeg -i ${filepath}/reddit.png -i assets/image/redditbg.png -filter_complex "[1:v][0:v]scale=rw:rh[bg];[bg][0:v]overlay=x=0:y=0:format=auto[out]" -map "[out]" -preset ${findpreset(args)} ${filepath}/output.png`)
            return await sendFile(msg, filepath, `output.png`)
        } else if (type.mime.startsWith('video')) {
            var filepath = await downloadFile(currenturl, `input.mp4`, {
                fileinfo
            })
            var filename = `input.mp4`

            var reddittop = await Jimp.read(`assets/image/reddittop.png`)
            var redditbottom = await Jimp.read(`assets/image/redditbottom.png`)
            var ibm = await Jimp.loadFont(`assets/fonts/IBMPlexSans/IBMPlexSans.fnt`)
            await Jimp.print(reddittop, ibm, 18, 315, { text: text, alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT, alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE }, 364, 66)
            await reddittop.writeAsync(`${filepath}/top.png`)

            var fps = fileinfo.info.fps

            await execPromise(`ffmpeg -r ${fps.includes('0/0') ? '50' : fps} -i ${filepath}/top.png -r ${fps.includes('0/0') ? '50' : fps} -i ${filepath}/${filename} -r ${fps.includes('0/0') ? '50' : fps} -i assets/image/redditbottom.png -map 1:a? -filter_complex "[1:v]scale=${reddittop.bitmap.width}:-1[scaled];[0:v][scaled][2:v]vstack=inputs=3,scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -preset ${findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/reddit.mp4`)
            var scale = await execPromise(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 ${filepath}/reddit.mp4`)
            scale = scale.replace(/\n|\r/g, '').split('x')
            var width = Number(scale[0])
            var height = Number(scale[1])

            await execPromise(`ffmpeg -r ${fps.includes('0/0') ? '50' : fps} -i ${filepath}/reddit.mp4 -r ${fps.includes('0/0') ? '50' : fps} -i assets/image/redditbg.png -map 0:a? -filter_complex "[1:v][0:v]scale=rw:rh[bg];[bg][0:v]overlay=x=0:y=0:format=auto,scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -preset ${findpreset(args)} -aspect ${width}:${height} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)
            return await sendFile(msg, filepath, `output.mp4`)
        } else if (type.mime.startsWith('image') && vars.gifFormats.find(f => f === type.ext)) {
            var filepath = await downloadFile(currenturl, `input.gif`)
            var filename = `input.gif`

            var reddittop = await Jimp.read(`assets/image/reddittop.png`)
            var redditbottom = await Jimp.read(`assets/image/redditbottom.png`)
            var ibm = await Jimp.loadFont(`assets/fonts/IBMPlexSans/IBMPlexSans.fnt`)
            await Jimp.print(reddittop, ibm, 18, 315, { text: text, alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT, alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE }, 364, 66)
            await reddittop.writeAsync(`${filepath}/top.png`)

            var fps = fileinfo.info.fps

            await execPromise(`ffmpeg -r ${fps.includes('0/0') ? '50' : fps} -i ${filepath}/top.png -r ${fps.includes('0/0') ? '50' : fps} -i ${filepath}/${filename} -r ${fps.includes('0/0') ? '50' : fps} -i assets/image/redditbottom.png -filter_complex "[1:v]scale=${reddittop.bitmap.width}:-1[scaled];[0:v][scaled][2:v]vstack=inputs=3,split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${findpreset(args)} -gifflags -offsetting ${filepath}/reddit.gif`)
            var scale = await execPromise(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 ${filepath}/reddit.gif`)
            scale = scale.replace(/\n|\r/g, '').split('x')
            var width = Number(scale[0])
            var height = Number(scale[1])

            await execPromise(`ffmpeg -r ${fps.includes('0/0') ? '50' : fps} -i ${filepath}/reddit.gif -r ${fps.includes('0/0') ? '50' : fps} -i assets/image/redditbg.png -filter_complex "[1:v][0:v]scale=rw:rh[bg];[bg][0:v]overlay=x=0:y=0:format=auto,split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${findpreset(args)} -aspect ${width}:${height} -gifflags -offsetting ${filepath}/output.gif`)
            return await sendFile(msg, filepath, `output.gif`)
        } else {
            await msg.reply({
                content: `Unsupported file: \`${currenturl}\``,
                allowedMentions: fetchPingPerms(msg)
            }).catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return
        }
    },
    help: {
        name: 'reddit {name} {file}',
        value: 'The kind stranger has arrived.'
    },
    cooldown: 2500,
    type: 'Memes'
}