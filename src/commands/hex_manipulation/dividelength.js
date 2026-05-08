module.exports = {
    name: ['dividelength', 'divideduration'],
    args: [{ "name": "multiplier", "required": false, "specifarg": false, "orig": "[multiplier (from 1 to 6)]" }, { "name": "file", "required": false, "specifarg": false, "orig": "{file}" }],
    execute: async function (msg, args) {
        let poopy = this
        let { lastUrl, validateFile, downloadFile, sendFile, fetchPingPerms } = poopy.functions
        let { fs } = poopy.modules

        msg.channel.sendTyping().catch(() => { })
        if (lastUrl(msg, 0) === undefined && args[1] === undefined) {
            await msg.reply('What is the file?!').catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = lastUrl(msg, 0) || args[1]
        var speed = isNaN(Number(args[1])) ? 2 : Number(args[1]) <= 1 ? 1 : Number(args[1]) >= 6 ? 6 : Number(args[1]) || 2
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

        if (type.mime.startsWith('video')) {
            var filepath = await downloadFile(currenturl, `input.mp4`, { fileinfo })
            var filename = `input.mp4`
            var videohex = fs.readFileSync(`${filepath}/${filename}`)

            var mvhdindex = videohex.indexOf('mvhd')

            var durationStart = mvhdindex + 20
            var durationEnd = mvhdindex + 24
            var oldDuration = videohex.readUInt32BE(durationStart)

            var newDuration = Math.min(oldDuration / speed, 0xFFFFFFFF)
            var newDurationBuffer = Buffer.alloc(4)
            newDurationBuffer.writeUInt32BE(newDuration)

            var subarray1 = videohex.subarray(0, durationStart)
            var subarray2 = videohex.subarray(durationEnd)
            var newvideohex = Buffer.concat([subarray1, newDurationBuffer, subarray2])

            fs.writeFileSync(`${filepath}/output.mp4`, newvideohex)
            return await sendFile(msg, filepath, `output.mp4`)
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
        name: 'dividelength/divideduration [multiplier (from 1 to 6)] {file}',
        value: "Manipulates the video's Hex Code to divide its duration."
    },
    cooldown: 2500,
    type: 'Hex Manipulation'
}
