module.exports = {
    name: ['txtfile', 'textfile'],
    args: [
        { name: "text", required: true, specifarg: false, orig: "<text>" }
    ],
    execute: async function (msg, args) {
        let poopy = this
        let { sendFile } = poopy.functions
        let { fs, Discord } = poopy.modules
        let vars = poopy.vars
        let config = poopy.config

        var saidMessage = args.slice(1).join(' ')
        if (args[1] === undefined) {
            saidMessage = ''
        }
        
        var currentcount = vars.filecount
        vars.filecount++
        var filepath = `temp/${config.database}/file${currentcount}`
        fs.mkdirSync(`${filepath}`)
        fs.writeFileSync(`${filepath}/output.txt`, saidMessage)

        return await sendFile(msg, filepath, 'output.txt')
    },
    help: {
        name: 'txtfile/textfile <text>',
        value: 'Converts the input into a txt file.'
    },
    cooldown: 1000,
    type: 'Conversion'
}
