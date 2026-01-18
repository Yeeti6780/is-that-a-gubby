module.exports = {
    name: [''],
    args: [],
    execute: async function (msg, args) {
        let poopy = this
        let { chat, randomChoice, fetchPingPerms } = poopy.functions
        let { DiscordTypes } = poopy.modules
        let arrays = poopy.arrays
        let config = poopy.config
        let data = poopy.data

        var bypassPerms = (
            msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.ManageGuild) ||
            msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.ManageMessages) ||
            msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) ||
            msg.author.id === msg.guild.ownerId ||
            (config.ownerids.find(id => id == msg.author.id))
        )
        
        if (
            process.env.AI21_KEY &&
            !(data.guildData[msg.guild.id]?.disabled.find(cmd => cmd.find(n => n === "chat")) && !bypassPerms) &&
            args.length > 1
        ) {
            var saidMessage = args.slice(1).join(' ')
            
            var chatResponse = await chat(saidMessage, msg, {
                errorMsg: randomChoice(arrays.eightball)
            }).catch(() => { }) ?? "what"
            
            if (!msg.nosend) await msg.reply({
                content: chatResponse,
                allowedMentions: fetchPingPerms(msg)
            }).catch(() => { })
            
            return chatResponse
        }
        
        if (!msg.nosend) await msg.reply("crimes").catch(() => { })
        return "crimes"
    },
    help: {
        name: '',
        value: 'crimes'
    },
    cooldown: 2500,
    type: 'Inside Joke'
}
