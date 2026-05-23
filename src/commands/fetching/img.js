module.exports = {
    name: ['img', 'image'],
    args: [{name: "query",required: true,specifarg: false,orig: "<query>"},{name: "page",required: false,specifarg: true,orig: "[-page <number>]"}],
    execute: async function (msg, args) {
        let poopy = this
        let { navigateEmbed, addLastUrl } = poopy.functions
        let { DiscordTypes, HTTPClientUtils } = poopy.modules
        let config = poopy.config

        msg.channel.sendTyping().catch(() => { })
        if (args[1] === undefined) {
            await msg.reply('What do I search for?!').catch(() => { })
            return;
        }

        var page = 1
        var pageindex = args.indexOf('-page')
        if (pageindex > -1) {
            page = isNaN(Number(args[pageindex + 1])) ? 1 : Number(args[pageindex + 1]) <= 1 ? 1 : Math.round(Number(args[pageindex + 1])) || 1
            args.splice(pageindex, 2)
        }

        var search = args.slice(1).join(" ");

        var urls = await HTTPClientUtils.fetchImages(search, { unsafe: msg.channel.nsfw }).catch((e) => console.log(e))

        if (!urls) {
            await msg.reply('Error.').catch(() => { })
            return;
        }

        if (!urls.length) {
            await msg.reply('Not found.').catch(() => { })
            return;
        }

        var number = page
        if (number > urls.length) number = urls.length;
        if (number < 1) number = 1

        if (!msg.nosend) await navigateEmbed(msg.channel, async (page) => {
            addLastUrl(msg, urls[page - 1].image)

            if (config.textEmbeds) return `**[${urls[page - 1].image}](${urls[page - 1].url})**\n\nImage ${page}/${urls.length}`
            else return {
                title: "Image Search Results For " + search,
                description: `**[${urls[page - 1].title}](${urls[page - 1].url})**`,
                color: 0x472604,
                footer: {
                    text: "Image " + page + "/" + urls.length
                },
                image: {
                    url: urls[page - 1].image
                },
                author: {
                    name: msg.author.tag,
                    icon_url: msg.author.displayAvatarURL({ dynamic: true, size: 1024, extension: 'png' })
                }
            }
        }, urls.length, msg.member, [
            {
                emoji: '1507804009535246418',
                reactemoji: '❌',
                customid: 'delete',
                style: DiscordTypes.ButtonStyle.Danger,
                function: async (_, __, resultsMsg, collector) => {
                    collector.stop()
                    if (msg.isUserApp) msg.deleteReply().catch(() => { })
                    else resultsMsg.delete().catch(() => { })
                },
                page: false
            }
        ], number, undefined, undefined, undefined, msg)
        return urls[page - 1].image
    },
    help: {
        name: 'img/image <query> [-page <number>]',
        value: 'Search for a random image in the web using DuckDuckGo.\nExample usage: p:img Burger -page 5'
    },
    cooldown: 2500,
    type: 'Fetching'
}