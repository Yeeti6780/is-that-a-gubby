module.exports = {
    name: ['speechbubble', 'speech'],
    args: [
        { "name": "file", "required": false, "specifarg": false, "orig": "{file}" },
        { "name": "transparent", "required": false, "specifarg": true, "orig": "[-transparent]" }
    ],
    execute: async function (msg, args) {
        let poopy = this
        let {
            lastUrl, validateFile, downloadFile, execPromise,
            findpreset, sendFile, fetchPingPerms
        } = poopy.functions
        let vars = poopy.vars

        var isTransparent = args.includes("-transparent")

        await msg.channel.sendTyping().catch(() => { })
        if (lastUrl(msg, 0) === undefined && args[1] === undefined) {
            await msg.reply('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = lastUrl(msg, 0) || args[1]
        var fileinfo = await validateFile(currenturl).catch(async error => {
            await msg.reply({
                content: error,
                allowedMentions: fetchPingPerms(msg)
            }).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        })

        if (!fileinfo) return
        var type = fileinfo.type
        
        if (!type.mime.startsWith('image') && !type.mime.startsWith('video')) {
            await msg.reply({
                content: `Unsupported file: \`${currenturl}\``,
                allowedMentions: fetchPingPerms(msg)
            }).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return
        }

        var width = fileinfo.info.width
        var height = fileinfo.info.height

        if (type.mime.startsWith('image') && !(vars.gifFormats.find(f => f === type.ext))) {
            var filepath = await downloadFile(currenturl, `input.png`, {
                fileinfo
            })
            var filename = `input.png`

            await execPromise(`ffmpeg -i ${filepath}/${filename} -i assets/image/speechbubble${isTransparent ? 'tomask': ''}.png -filter_complex "[1:v]scale=${width}:${Math.round(height * 0.2)}[overlay];[0:v][overlay]overlay=shortest=1:x=0:y=0:format=auto[out]" -map "[out]" -preset ${findpreset(args)} ${filepath}/output${isTransparent ? 'tomask': ''}.png`)
            if (isTransparent) await execPromise(`ffmpeg -i ${filepath}/outputtomask.png -i assets/image/speechbubblemask.png -f lavfi -i "color=0xFFFFFFFF:s=${width}x${height},format=rgba" -filter_complex "[1:v]scale=${width}:${Math.round(height * 0.2)},hue=s=0[overlay];[2:v][overlay]overlay=x=0:y=0:format=auto[blend];[0:v]alphaextract[alpha];[alpha][blend]blend=all_mode=multiply[mask];[0:v][mask]alphamerge[out]" -map "[out]" -preset ${findpreset(args)} ${filepath}/output.png`)
            return await sendFile(msg, filepath, `output.png`)
        } else if (type.mime.startsWith('video')) {
            var filepath = await downloadFile(currenturl, `input.mp4`, {
                fileinfo
            })
            var filename = `input.mp4`

            await execPromise(`ffmpeg -i ${filepath}/${filename} -stream_loop -1 -i assets/image/speechbubble${isTransparent ? 'tomask': ''}.png -map 0:a? -filter_complex "[1:v]scale=${width}:${Math.round(height * 0.2)}[overlay];[0:v][overlay]overlay=shortest=1:x=0:y=0:format=auto[sout];[sout]scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -preset ${findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/output${isTransparent ? 'tomask': ''}.mp4`)
            if (isTransparent) await execPromise(`ffmpeg -i ${filepath}/outputtomask.mp4 -i assets/image/speechbubblemask.png -f lavfi -i "color=0xFFFFFFFF:s=${width}x${height},format=rgba" -map 0:a? -filter_complex "[1:v]scale=${width}:${Math.round(height * 0.2)},hue=s=0[overlay];[2:v][overlay]overlay=x=0:y=0:format=auto[blend];[0:v]alphaextract[alpha];[alpha][blend]blend=all_mode=multiply[amask];[amask]colorkey=0xFFFFFF:0.01:1,curves=r='0/0 1/0':g='0/0 1/0':b='0/0 1/0'[mask];[0:v][mask]overlay=shortest=1:format=auto:x=0:y=0,scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -preset ${findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)
            return await sendFile(msg, filepath, `output.mp4`)
        } else if (type.mime.startsWith('image') && vars.gifFormats.find(f => f === type.ext)) {
            var filepath = await downloadFile(currenturl, `input.gif`, {
                fileinfo
            })
            var filename = `input.gif`

            await execPromise(`ffmpeg -i ${filepath}/${filename} -stream_loop -1 -i assets/image/speechbubble${isTransparent ? 'tomask': ''}.png -filter_complex "[1:v]scale=${width}:${Math.round(height * 0.2)}[overlay];[0:v][overlay]overlay=shortest=1:x=0:y=0:format=auto[sout];[sout]split[gnout][gpout];[gpout]palettegen=reserve_transparent=1[palette];[gnout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${findpreset(args)} -gifflags -offsetting ${filepath}/output${isTransparent ? 'tomask': ''}.gif`)
            if (isTransparent) await execPromise(`ffmpeg -i ${filepath}/outputtomask.gif -stream_loop -1 -i assets/image/speechbubblemask.png -f lavfi -i "color=0x00AC91FF:s=${width}x${height},format=rgba" -filter_complex "[1:v]scale=${width}:${Math.round(height * 0.2)},hue=s=0[overlay];[2:v][overlay]overlay=x=0:y=0:format=auto[blend];[0:v]alphaextract[alpha];[alpha][blend]blend=all_mode=multiply[amask];[amask]colorkey=0xFFFFFF:0.01:1,curves=r='0/0 1/0':g='0/0 1/${172 / 255}':b='0/0 1/${145 / 255}'[mask];[0:v][mask]overlay=shortest=1:x=0:y=0:format=auto,colorkey=0x00AC91:0.01:0,split[gnout][gpout];[gpout]palettegen=reserve_transparent=1[palette];[gnout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${findpreset(args)} -gifflags -offsetting ${filepath}/output.gif`)
            return await sendFile(msg, filepath, `output.gif`)
        }
    },
    help: { name: 'speechbubble/speech {file} [-transparent]', value: 'Adds a speech bubble to the file, instantly making it 100 times funnier.' },
    cooldown: 2500,
    type: 'Memes'
}