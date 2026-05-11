module.exports = {
    name: ['displayjson'],
    args: [{
        name: "json", required: true, specifarg: false, orig: "<json (funnygif, poop, dmphrases, shitting, eightball)>", autocomplete: [
            'funnygif',
            'poop',
            'dmphrases',
            'shitting',
            'eightball'
        ]
    }],
    execute: async function (msg, args) {
        let poopy = this
        let config = poopy.config
        let vars = poopy.vars
        let { fs, Discord } = poopy.modules
        let globaldata = poopy.globaldata

        var jsonid = config.ownerids.find(id => id == msg.author.id) || config.jsoning.find(id => id == msg.author.id);
        if (jsonid === undefined) {
            await msg.reply('Sorry... You\'re not in the JSON gang.').catch(() => { })
            return
        } else {
            var types = ['funnygif', 'poop', 'dmphrases', 'shitting', 'eightball']

            if (args[1] === undefined) {
                await msg.reply(`What is the JSON to display?! (Available: ${types.map(t => `**${t}**`).join(', ')})`).catch(() => { })
                return;
            }

            var type

            if (types.find(t => t === args[1].toLowerCase())) {
                type = args[1].toLowerCase()
            } else {
                await msg.reply('Not a JSON type.').catch(() => { })
                return
            }

            var currentcount = vars.filecount
            vars.filecount++
            var filepath = `temp/${config.database}/file${currentcount}`
            fs.mkdirSync(filepath)
            fs.writeFileSync(`${filepath}/jsonlist.txt`, globaldata[type].join('\n\n-----------------------------------------------\n\n') || 'lmao theres nothing')
            if (!msg.nosend) await msg.reply({
                files: [new Discord.AttachmentBuilder(`${filepath}/jsonlist.txt`)]
            }).catch(() => { })
            fs.rmSync(`${filepath}`, { force: true, recursive: true })

            return globaldata[type].join('\n\n-----------------------------------------------\n\n') || 'lmao theres nothing'
        };
    },
    help: {
        name: 'displayjson <json (funnygif, poop, dmphrases, shitting, eightball)>',
        value: "Displays the values of a JSON like oil or DM phrases."
    },
    cooldown: 2500,
    type: 'JSON Gang'
}