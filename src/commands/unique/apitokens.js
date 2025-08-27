module.exports = {
    name: ['apitokens', 'managetokens'],
    args: [{
        "name": "option",
        "required": true,
        "specifarg": false,
        "orig": "<option>"
    }],
    subcommands: [{
        "name": "help",
        "args": [],
        "description": "Get a list of tokens you can manage, and how to get them."
    },
    {
        "name": "list",
        "args": [{
            "name": "show",
            "required": false,
            "specifarg": true,
            "orig": "[-show]"
        }],
        "description": "Show a list of all your tokens."
    },
    {
        "name": "add",
        "args": [{
            "name": "token",
            "required": true,
            "specifarg": false,
            "orig": "<token>",
            "autocomplete": [
                'AI21_KEY',
                'REMOVEBG_KEY'
            ]
        },
        {
            "name": "value",
            "required": true,
            "specifarg": false,
            "orig": "<value>"
        }],
        "description": "Add a new token value to your tokens, multiple can be used."
    },
    {
        "name": "reset",
        "args": [{
            "name": "token",
            "required": true,
            "specifarg": false,
            "orig": "<token>",
            "autocomplete": [
                'AI21_KEY',
                'REMOVEBG_KEY'
            ]
        }],
        "description": "Removes all of the token's values and resets to the bot's defaults."
    }],
    execute: async function (msg, args) {
        let poopy = this
        let data = poopy.data
        let bot = poopy.bot
        let config = poopy.config
        let { CryptoJS } = poopy.modules
        let { decrypt, fetchPingPerms } = poopy.functions

        let tokenList = {
            AI21_KEY: {
                uses: "`chat`",
                method: 'Create an AI21 Studio account (https://studio.ai21.com/sign-up), then go to your account (https://studio.ai21.com/account/account) and copy the API key',
                example: '4QRVuB48Djt1ckJa8TQcAMRPEY8hL7V3'
            },
            REMOVEBG_KEY: {
                uses: '`removebg`',
                method: 'Make a Kaleido account (https://accounts.kaleido.ai/users/sign_in), go to your dashboard and click the API keys tab (https://www.remove.bg/dashboard#api-key). Click to create a new API key and then copy it',
                example: 'SjcTC3wvNapVN571Eu8hpA14'
            }
        }

        var options = {
            help: async (msg) => {
                if (!msg.nosend) {
                    var dmChannel = await msg.author.createDM().catch(() => { })

                    if (dmChannel) {
                        if (config.textEmbeds) await dmChannel.send(`Here, you can manage your own keys and tokens to freely access APIs without having to deal with the bot's quotas and limits! Multiple tokens can be used for each API, they're encrypted when saved.\n\n${Object.keys(tokenList).map(token => {
                            var tokenInfo = tokenList[token]

                            return `\`${token}\`\n> **Used in:** ${tokenInfo.uses}\n> **Method:** ${tokenInfo.method}\n> **Example Token:** ${tokenInfo.example}`
                        }).join('\n\n')}`.substring(0, 2000)).catch(async () => {
                            await msg.reply('Couldn\'t send info to you. Do you have me blocked?').catch(() => { })
                            return
                        })
                        else await dmChannel.send({
                            embeds: [{
                                "title": 'API Tokens',
                                "description": "Here, you can manage your own keys and tokens to freely access APIs without having to deal with the bot's quotas and limits! Multiple tokens can be used for each API, they're encrypted when saved.",
                                "color": 0x472604,
                                "footer": {
                                    icon_url: bot.user.displayAvatarURL({ dynamic: true, size: 1024, extension: 'png' }),
                                    text: bot.user.displayName
                                },
                                "fields": Object.keys(tokenList).map(token => {
                                    var tokenInfo = tokenList[token]

                                    return {
                                        name: `\`${token}\``,
                                        value: `**Used in:** ${tokenInfo.uses}\n**Method:** ${tokenInfo.method}\n**Example Token:** ${tokenInfo.example}`
                                    }
                                })
                            }]
                        }).then(async () => await msg.reply(`✅ Check your DMs.`).catch(() => { })).catch(async () => {
                            await msg.reply('Couldn\'t send info to you. Do you have me blocked?').catch(() => { })
                            return
                        })
                    } else await msg.reply('Couldn\'t send help to you. Do you have me blocked?').catch(() => { })
                }

                return `Here, you can manage your own keys and tokens to freely access APIs without having to deal with the bot's quotas and limits! Multiple tokens can be used for each API, they're encrypted when saved.\n\n${Object.keys(tokenList).map(token => {
                    var tokenInfo = tokenList[token]

                    return `\`${token}\`\n> **Used in:** ${tokenInfo.uses}\n> **Method:** ${tokenInfo.method}\n> **Example Token:** ${tokenInfo.example}`
                }).join('\n\n')}`
            },

            list: async (msg) => {
                if (!msg.nosend) {
                    if (config.textEmbeds) await msg.reply({
                        content: Object.keys(tokenList).map(token => {
                            var tokens = data.userData[msg.author.id].tokens[token] ?? []

                            return `\`${token}\` -> ${tokens.length > 0 ? tokens.map(t => decrypt(t, !args.includes('-show'))).join(', ') : 'None.'}`
                        }).join('\n').substring(0, 2000),
                        allowedMentions: {
                            parse: fetchPingPerms(msg)
                        }
                    }).catch(() => { })
                    else await msg.reply({
                        embeds: [{
                            "title": 'Token Manager',
                            "description": Object.keys(tokenList).map(token => {
                                var tokens = data.userData[msg.author.id].tokens[token] ?? []

                                return `\`${token}\` -> ${tokens.length > 0 ? tokens.map(t => decrypt(t, !args.includes('-show'))).join(', ') : 'None.'}`
                            }).join('\n'),
                            "color": 0x472604,
                            "footer": {
                                icon_url: bot.user.displayAvatarURL({ dynamic: true, size: 1024, extension: 'png' }),
                                text: bot.user.displayName
                            }
                        }],
                        allowedMentions: {
                            parse: fetchPingPerms(msg)
                        }
                    }).catch(() => { })
                }

                return Object.keys(tokenList).map(token => {
                    var tokens = data.userData[msg.author.id].tokens[token] ?? []

                    return `\`${token}\` -> ${tokens.length > 0 ? tokens.map(t => decrypt(t, !args.includes('-show'))).join(', ') : 'None.'}`
                }).join('\n')
            },

            add: async (msg, args) => {
                var token = args[1]
                var value = args[2]

                if (!token) {
                    await msg.reply("What's the token name?!")
                    return
                }

                if (!value) {
                    await msg.reply("What's the token value?!").catch(() => { })
                    return
                }

                var tokenData = tokenList[token]

                if (!tokenData) {
                    await msg.reply("Invalid token name.").catch(() => { })
                    return
                }

                var tokenRegex = new RegExp(`^[a-zA-Z0-9_-]{${tokenData.example.length}}$`)

                if (!value.match(tokenRegex)) {
                    await msg.reply("Invalid token value.").catch(() => { })
                    return
                }

                var encrypted = CryptoJS.AES.encrypt(value, process.env.AUTH_TOKEN).toString()

                var tokens = data.userData[msg.author.id].tokens

                tokens[token] = tokens[token] ?? []
                tokens[token].push(encrypted)

                if (!msg.nosend) await msg.reply({
                    content: `✅ \`${token}\` added.`,
                    allowedMentions: {
                        parse: fetchPingPerms(msg)
                    }
                }).catch(() => { })
                return `✅ \`${token}\` added.`
            },

            reset: async (msg, args) => {
                var token = args[1]

                if (!token) {
                    await msg.reply("What's the token name?!")
                    return
                }

                var tokenData = tokenList[token]

                if (!tokenData) {
                    await msg.reply("Invalid token name.").catch(() => { })
                    return
                }

                delete data.userData[msg.author.id].tokens[token]

                if (!msg.nosend) await msg.reply({
                    content: `✅ \`${token}\` has been reset.`,
                    allowedMentions: {
                        parse: fetchPingPerms(msg)
                    }
                }).catch(() => { })
                return `✅ \`${token}\` has been reset.`
            }
        }

        if (!args[1]) {
            var instruction = "**help** - Get a list of tokens you can manage, and how to get them.\n**list** [-show] - Show a list of all your tokens.\n**add** <token> <value> - **DON'T USE THIS IN A PUBLIC SERVER!** Add a new token value to your tokens, multiple can be used.\n**reset** <token> - Removes all of the token's values and resets to the bot's defaults."
            if (!msg.nosend) {
                if (config.textEmbeds) msg.reply({
                    content: instruction,
                    allowedMentions: {
                        parse: fetchPingPerms(msg)
                    }
                }).catch(() => { })
                else msg.reply({
                    embeds: [{
                        "title": "Available Options",
                        "description": instruction,
                        "color": 0x472604,
                        "footer": {
                            "icon_url": bot.user.displayAvatarURL({
                                dynamic: true, size: 1024, extension: 'png'
                            }),
                            "text": bot.user.displayName
                        },
                    }]
                }).catch(() => { })
            }

            return instruction
        }

        if (!options[args[1].toLowerCase()]) {
            await msg.reply('Not a valid option.').catch(() => { })
            return
        }

        return await options[args[1].toLowerCase()](msg, args.slice(1))
    },
    help: {
        name: 'apitokens/managetokens <option>',
        value: "**ONLY USE THIS COMMAND IN PRIVATE SERVERS!** Manage tokens for different APIs, like remove.bg, YouTube, OCR, and many others. Use the command alone for more info."
    },
    cooldown: 5000,
    type: 'Unique'
}
