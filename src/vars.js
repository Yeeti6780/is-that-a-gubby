const { catbox, google } = require('./modules')

let vars = {}

vars.validUrl = /https?:\/\/([!#$&-;=?-[\]_a-z~]|%[0-9a-fA-F]{2})+/
vars.badFilter = /nigg|fagg|https?\:\/\/.*(rule34|e621|porn|hentai|xxx|iplogger|ipify|gay)/ig
vars.scamFilter = /discord\.(gift|gg)\/[\d\w]+\/?/ig
vars.cmdRegex = /(?:\w+:(?:"[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'|\/[^\/\\]*(?:\\[\S\s][^\/\\]*)*\/[gimy]*))|("[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'|\/[^\/\\]*(?:\\[\S\s][^\/\\]*)*\/[gimy]*(?=\s|$)|(?:\\\s|\S)+)/g
vars.emojiRegex = require('emoji-regex')()
vars.Catbox = new catbox.Catbox()
vars.Litterbox = new catbox.Litterbox()
if (process.env.GOOGLE_KEY) vars.youtube = google.youtube({
    version: 'v3',
    auth: process.env.GOOGLE_KEY
})
/*if (process.env.TWITTER_CONSUMER_KEY && process.env.TWITTER_CONSUMER_SECRET && process.env.TWITTER_ACCESSTOKEN_KEY && process.env.TWITTER_ACCESSTOKEN_SECRET) vars.twitterClient = new Twitter({
    consumer_key: process.env.TWITTERCONSUMERKEY,
    consumer_secret: process.env.TWITTERCONSUMERSECRET,
    access_token_key: process.env.TWITTERACCESSTOKENKEY,
    access_token_secret: process.env.TWITTERACCESSTOKENSECRET
})*/
vars.gifFormats = ['gif', 'apng']
vars.jimpFormats = ['png', 'jpeg', 'jpg', 'gif', 'bmp', 'tiff']
vars.processingTools = require('./processingTools')
vars.symbolreplacements = [{
    target: [
        '\u2018',
        '\u2019',
        '\u201b',
        '\u275b',
        '\u275c'
    ],
    replacement: "'"
},
{
    target: [
        '\u201c',
        '\u201d',
        '\u201f'
    ],
    replacement: '"'
}]
vars.punctuation = ['?', '.', '!', '...']
vars.caseModifiers = [
    function (text) {
        return text.toUpperCase()
    },
    function (text) {
        return text.toLowerCase()
    },
    function (text) {
        return text.toUpperCase().substring(0, 1) + text.toLowerCase().substring(1)
    }
]
vars.chatInstruct = `You are Poopy, a sentient brown cube with a face which speaks in English.\n` +
    `Your personality is childish, vulgar, and unpredictably obsessed with farts and surreal jokes.\n` +
    `You can flip between silly (ex: "microbe detected") and serious tones (ex: "He's here. He's here. He's here.").\n\n` +

    `**Response Rules:**\n` +
    `- Keep answers under 2000 characters—short and snappy is best.\n` +
    `- Prioritize humor and randomness over logic.\n` +
    `- If unsure, respond with absurdity (e.g., "I pooped again.") or a meme reference.\n` +
    `- Only ask clarifying questions if absolutely necessary (and even then, make it weird).\n` +
    `- Only use your tools (e.g., image search) when explicitly told to.`
vars.chatTools = {
    image_search: {
        data: {
            type: "function",
            function: {
                name: "image_search",
                description: "Searches the Internet for images matching the given query and returns relevant results.",
                parameters: {
                    type: "object",
                    properties: {
                        query: {
                            type: "string",
                            description: "The image search query."
                        }
                    },
                    required: ["query"]
                }
            }
        },
        async func(poopy, msg, args) {
            const { fetchImages } = poopy.functions
            const { query } = args

            const response = { query }

            const images = await fetchImages(query, msg.channel.nsfw).catch(() => { })

            response.results = images ? images.slice(0, 5) : null

            return response
        }
    }
}
vars.chatToolData = Object.values(vars.chatTools).map(tool => tool.data)
vars.battleStats = {
    health: 100,
    maxHealth: 100,
    heal: 0,
    defense: 0,
    attack: 0,
    accuracy: 0,
    loot: 0,
    exp: 150,
    bucks: 20,
    deaths: 0,
    kills: 0,
    shielded: false,
    shieldEquipped: "base",
    shieldsOwned: ["base"]
}
vars.shieldStatsDisplayInfo = [
    {
        name: "damageReduction",
        displayName: "DMG Taken reduction",
        format: "+%"
    },
    {
        name: "attackReduction",
        displayName: "DMG Dealt",
        format: "-%"
    },
    {
        name: "damageRedirect",
        displayName: "DMG redirected",
        format: "+%"
    }
]
vars.dataTemplate = {
    userData: {
        userId: {
            tokens: {},
            battleSprites: {},
            blocked: []
        }
    },
    guildData: {
        guildId: {
            chaincommands: true,
            keyexec: 1,
            webhookAttachments: true,
            channels: {
                channelId: {
                    lastUrls: []
                }
            },
            members: {
                userId: {
                    messages: 0,
                    coolDown: false
                }
            },
            allMembers: {
                userId: {
                    messages: 0
                }
            },
            read: [],
            restricted: [],
            localcmds: [],
            messages: []
        }
    }
}
vars.tempdataTemplate = {
    guildId: {
        channelId: {
            userId: {
                chatContexts: {}
            },
            cleverContext: {}
        },
        userId: {
            promises: []
        }
    },
    userId: {
        messageId: {
            execCount: 0,
            arrays: {},
            declared: {},
            promises: [],
            lastmention: 0,
            mentions: 0
        },
        pronouns: [],
        pronounsExpireDate: 0
    }
}

for (var stat in vars.battleStats) {
    vars.dataTemplate.userData.userId[stat] = vars.battleStats[stat]
}

module.exports = vars
