module.exports = {
    name: ['tomp3', 'toaudio', 'tosound'],
    args: [{name: "file",required: false,specifarg: false,orig: "{file}"}],
    execute: async function (msg, args) {
        let poopy = this
        let {
            lastUrl, validateFile, downloadFile, execPromise,
            findpreset, sendFile, fetchPingPerms
        } = poopy.functions
        let { path, fs } = poopy.modules

        msg.channel.sendTyping().catch(() => { })
        if (lastUrl(msg, 0) === undefined && args[1] === undefined) {
            await msg.reply('What is the file?!').catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = lastUrl(msg, 0) || args[1]
        var fileinfo = await validateFile(currenturl, true).catch(async error => {
            await msg.reply({
                content: error,
                allowedMentions: fetchPingPerms(msg)
            }).catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return;
        })

        if (!fileinfo) return
        var type = fileinfo.type

        if (type.mime.startsWith('video') || (type.mime.startsWith('audio') && type.ext !== 'mp3')) {
            var filepath = await downloadFile(currenturl, `input.${fileinfo.shortext}`, {
                fileinfo            })
            var filename = `input.${fileinfo.shortext}`
            var audio = fileinfo.info.audio

            if (audio) {
                await execPromise(`ffmpeg -i ${filepath}/${filename} -map 0:a -preset ${findpreset(args)} ${filepath}/output.mp3`)
                return await sendFile(msg, filepath, `output.mp3`)
            } else {
                await msg.reply('No audio stream detected.').catch(() => { })
                msg.channel.sendTyping().catch(() => { })
                fs.rmSync(`${filepath}`, { force: true, recursive: true })
            }
        } else if (type.mime.startsWith('audio') && type.ext === 'mp3') {
            return await sendFile(msg, path.dirname(fileinfo.path), `output.mp3`, { keep: true })
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
        name: 'tomp3/toaudio/tosound {file}',
        value: 'Converts the video to MP3.'
    },
    cooldown: 2500,
    type: 'Conversion'
}