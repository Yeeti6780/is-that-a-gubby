module.exports = {
    name: ['petpet', 'pet'],
    args: [{ name: "file", required: false, specifarg: false, orig: "{file}" }],
    execute: async function (msg, args) {
        let poopy = this
        let {
            lastUrl, validateFile, downloadFile, execPromise,
            findpreset, sendFile, fetchPingPerms
        } = poopy.functions
        let vars = poopy.vars

        msg.channel.sendTyping().catch(() => { })
        if (lastUrl(msg, 0) === undefined && vars.validUrl.test(args[args.length - 1]) === false) {
            await msg.reply('What is the file?!').catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return;
        };
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

        if (type.mime.startsWith('image') || type.mime.startsWith('video')) {
            var filepath = await downloadFile(currenturl, `input.${fileinfo.shortext}`, {
                fileinfo
            })
            var filename = `input.${fileinfo.shortext}`

            await execPromise(`ffmpeg -stream_loop -1 -t 0.2 -i ${filepath}/${filename} -i assets/image/petpet.gif -r 50 -stream_loop -1 -t 0.2 -i assets/image/transparent.png -filter_complex "[0:v]fps=50,scale=112*(0.8+(if(lt(n\\,5)\\,n\\,10-n))*0.02):112*(0.8-(if(lt(n\\,5)\\,n\\,10-n))*0.05):eval=frame[overlay];[2:v]scale=112:112[transparent];[transparent][overlay]overlay=x=112*((1-(0.8 + (if(lt(n\\,5)\\,n\\,10-n))*0.02))*0.5 + 0.1):y=112*(1-(0.8 - (if(lt(n\\,5)\\,n\\,10-n))*0.05)-0.08):format=auto[petoverlay];[petoverlay][1:v]overlay=x=0:y=0:format=auto,split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${findpreset(args)} -gifflags -offsetting -r 50 -t 0.2 ${filepath}/output.gif`)
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
        name: 'petpet/pet {file}',
        value: 'Allows you to pet the file... Wow! Try it out yourself at https://benisland.neocities.org/petpet/'
    },
    cooldown: 2500,
    type: 'Memes'
}