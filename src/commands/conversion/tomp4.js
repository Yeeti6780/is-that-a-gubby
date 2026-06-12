module.exports = {
    name: ['tomp4', 'tovideo'],
    args: [{name: "file",required: false,specifarg: false,orig: "{file}"}],
    execute: async function (msg, args) {
        let poopy = this
        let {
            lastUrl, validateFile, downloadFile, execPromise,
            findpreset, sendFile, fetchPingPerms
        } = poopy.functions
        let { path } = poopy.modules

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

        if (type.mime.startsWith('image') || (type.mime.startsWith('video') && type.ext !== 'mp4')) {
            var filepath = await downloadFile(currenturl, `input.${fileinfo.shortext}`, {
                fileinfo            })
            var filename = `input.${fileinfo.shortext}`
            await execPromise(`ffmpeg -i ${filepath}/${filename} -vf "scale='min(2000,iw)':min'(2000,ih)':force_original_aspect_ratio=decrease,scale=ceil(iw/2)*2:ceil(ih/2)*2" -preset ${findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)
            return await sendFile(msg, filepath, `output.mp4`)
        } else if (type.mime.startsWith('video') && type.ext === 'mp4') {
            return await sendFile(msg, path.dirname(fileinfo.path), `output.mp4`, { keep: true })
        } else {
            await msg.reply({
                content: `Unsupported file: \`${currenturl}\``,
                allowedMentions: fetchPingPerms(msg)
            }).catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return
        }
    },
    help: { name: 'tomp4/tovideo {file}', value: 'Converts the file to MP4.' },
    cooldown: 2500,
    type: 'Conversion'
}
