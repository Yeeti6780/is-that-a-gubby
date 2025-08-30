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
vars.defaultConfig = {
    testing: false,
    poosonia: false,
    hivemind: false,
    forcetrue: false,
    useReactions: false,
    textEmbeds: false,
    notSave: false,
    apiMode: false,
    noInfoPost: true,
    triggerPhrase: undefined,
    poosoniablacklist: ['dm', 'tdms', 'spam', 'eval', 'leave'],
    poosoniakeywordblacklist: [],
    poosoniafunctionblacklist: ['msgcollector', 'stopcollector', 'stopallcollectors'],
    allowtesting: true,
    allowpingresponses: true,
    allowbotusage: false,
    allowbottriggers: false,
    allowpresence: true,
    database: 'poopydata',
    globalPrefix: 'p:',
    stfu: false,
    intents: 46721,
    ownerids: ['464438783866175489', '454732245425455105', '613501149282172970', '486845950200119307', '714448511508414547', '395947826690916362', '340847078236225537', '1392969858878279811'],
    jsoning: ['411624455194804224', '486845950200119307'],
    illKillYouIfYouUseEval: ['535467581881188354'],
    guildfilter: {
        blacklist: true,
        ids: []
    },
    channelfilter: {
        blacklist: true,
        gids: [],
        ids: []
    },
    msgcooldown: 0,
    pingresponselimit: 0,
    pingresponsecooldown: 60000,
    limits: {
        size: {
            image: 20,
            gif: 20,
            video: 20,
            audio: 20,
            message: `that file exceeds the size limit of {param} mb hahahaha (try to use the shrink, setfps, trim or crunch commands)`
        },
        frames: {
            gif: 1000,
            video: 10000,
            message: `the frames in that file exceed the limit of {param} hahahaha (try to use the setfps or the trim commands)`
        },
        width: {
            image: 3000,
            gif: 1000,
            video: 2000,
            message: `the width of that file exceeds the limit of {param} hahahaha (try to use the shrink command)`
        },
        height: {
            image: 3000,
            gif: 1000,
            video: 2000,
            message: `the height of that file exceeds the limit of {param} hahahaha (try to use the shrink command)`
        }
    },
    limitsexcept: {
        size: {
            image: 100,
            gif: 100,
            video: 100,
            audio: 100,
            message: `that file exceeds the exception size limit of {param} mb hahahaha there's nothing you can do`
        },
        frames: {
            gif: 5000,
            video: 50000,
            message: `the frames in that file exceed the exception limit of {param} hahahaha there's nothing you can do`
        },
        width: {
            image: 10000,
            gif: 2000,
            video: 5000,
            message: `the width of that file exceeds the exception limit of {param} hahahaha there's nothing you can do`
        },
        height: {
            image: 10000,
            gif: 2000,
            video: 5000,
            message: `the height of that file exceeds the exception limit of {param} hahahaha there's nothing you can do`
        }
    },
    commandLimit: 5,
    defaultDisabled: [],
    keyLimit: 500,
    rateLimit: 3,
    rateLimitTime: 60000 * 2,
    processTimeout: 60000 * 2,
    memLimit: 0,
    quitOnDestroy: false
}
vars.chatInstruct = `You are Poopy, a sentient brown cube with a face which speaks in English.\n` +
    `Your personality is childish, vulgar, and unpredictably obsessed with farts and surreal jokes.\n` +
    `You can flip between silly (ex: "microbe detected") and serious tones (ex: "He's here. He's here. He's here.").\n\n` +

    `**Response Rules:**\n` +
    `- Keep answers under 2000 characters—short and snappy is best.\n` +
    `- Prioritize humor and randomness over logic.\n` +
    `- If unsure, respond with absurdity (e.g., "I pooped again.") or a meme reference.\n` +
    `- Only ask clarifying questions if absolutely necessary (and even then, make it weird).\n` +
    `- Only use your tools (e.g., image search) when EXPLICITLY told to.`
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
            username: "",

            dms: undefined,
            tokens: {},

            death: 0,
            battleSprites: {},
            blocked: [],

            ...vars.battleStats
        }
    },
    guildData: {
        guildId: {
            prefix: undefined,

            chaincommands: true,
            keyexec: 1,
            webhookAttachments: true,
            lastuse: 0,

            read: [],
            restricted: [],
            disabled: [],
            keyDisabled: [],
            funcDisabled: [],
            localcmds: [],
            messages: [],

            channels: {
                channelId: {
                    lastUrls: [],
                    lastuse: 0,
                    battling: false
                }
            },

            members: {
                userId: {
                    username: "",

                    messages: 0,
                    coolDown: false,
                    lastmessage: 0,
                    highestroleorder: 0,
                    bot: false
                }
            },

            allMembers: {
                userId: {
                    username: "",

                    messages: 0,
                    lastmessage: 0,
                    highestroleorder: 0,
                    bot: false
                }
            }
        }
    }
}
vars.tempdataTemplate = {
    guildId: {
        messages: [],
        
        channelId: {
            shutUp: false,
            forceResponse: undefined,

            webhooks: undefined,
            cleverContext: {},

            userId: {
                messageCollector: undefined,
                chatContexts: {}
            }
        },
        userId: {}
    },
    userId: {
        mentions: 0,
        lastMention: 0,

        fartRate: 0,
        lastFartRate: 0,

        coolDownMsg: undefined,
        rateLimit: 0,
        rateLimits: 0,
        rateLimited: 0,

        dmConsent: undefined,

        pronouns: [],
        pronounsExpireDate: 0,

        messageId: {
            lastUrls: undefined,

            execCount: 0,

            keyAttempts: 0,
            keyExecuting: 0,
            keywordsExecuted: [],

            declared: {},
            keyDeclared: {},
            funcDeclared: {},
            arrays: {},
            returnValue: undefined
        }
    }
}

for (var stat in vars.battleStats) {
    vars.dataTemplate.userData.userId[stat] = vars.battleStats[stat]
}

module.exports = vars
