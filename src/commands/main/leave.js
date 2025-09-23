module.exports = {
    name: ['leave'],
    args: [],
    execute: async function (msg, args) {
        let poopy = this
        let config = poopy.config
        let { yesno, fetchPingPerms } = poopy.functions
        let { DiscordTypes, Discord } = poopy.modules

        if (msg.channel.type == Discord.ChannelType.DM) {
            await msg.reply(`You can't get rid of me.`).catch(() => { })
            return
        }

        if (msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.ManageGuild) || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) || msg.author.id === msg.guild.ownerID || config.ownerids.find(id => id == msg.author.id)) {
            var phrases = [
                'idiot',
                'the salt',
                'why do you hate me',
                'i could kill you',
                'are you mentally disabled',
                'ratio',
                'now',
                'the audacity',
                'you like boys',
                'bull',
                'fat plumber mario',
                'im crying',
                'poopoo demon summoned',
                'im out of vitamins',
                'the poopening has begun',
                'kidney cancer alert',
                'stop',
                'chance of meatballs',
                'the poopy boss has spawned',
                `you had one shot ${(msg.member.displayName).toLowerCase().replace(/\@/g, '@‌')}`,
                'this is my undertale',
                'i hate the antichrist',
                'not the rats',
                'i can cut your body',
                'broomstick handle',
                '0',
                'what is the true purpose of society',
                'brought oil',
                'father figure',
                '<https://pikmin3.nintendo.com/buy-now/>',
                msg.member.toString(),
                'bong',
                'quesadilla',
                'pig',
                'youve missed the chance to try crab rice',
                'mug',
                '_ _'
            ]
            var confirm = msg.nosend || await yesno(msg.channel, 'are you sure about this', msg.member, undefined, msg).catch(() => { })

            if (confirm) {
                var phrase = phrases[Math.floor(Math.random() * phrases.length)]
                if (!msg.nosend) await msg.reply({
                    content: phrase,
                    allowedMentions: fetchPingPerms(msg)
                }).catch(() => { })

                if (msg.channel.type == Discord.ChannelType.GroupDM) msg.channel.delete().catch(() => { })
                else {
                    var left = await msg.guild.leave().catch(() => { })
                    if (!msg.nosend) await msg.reply(left).catch(() => { })
                }
                return phrase
            }
        } else {
            await msg.reply('You need the manage server permission to execute that!').catch(() => { })
            return
        }
    },
    help: { name: 'leave (manage server only)', value: 'good' },
    perms: ['Administrator', 'ManageGuild'],
    type: 'Main'
}
