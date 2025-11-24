module.exports = {
    name: ['starboard'],
    args: [{
        "name": "option",
        "required": true,
        "specifarg": false,
        "orig": "<option>"
    }],
    subcommands: [{
        "name": "list",
        "args": [],
        "description": "Gets a list of starboards set up in the server."
    },
    {
        "name": "info",
        "args": [{
            "name": "starboardId",
            "required": true,
            "specifarg": false,
            "orig": "<starboardId>",
            "autocompvare": function (interaction) {
                var poopy = this
                return poopy.data.botData.starboards.filter(c => c.guildId == interaction.guild.id).map(c => c.id)
            }
        }],
        "description": "Displays the info of the starboard that has been set up with the respective ID."
    },
    {
        "name": "add",
        "args": [{
            "name": "channel",
            "required": false,
            "specifarg": false,
            "orig": "[channel]",
            "autocomplete": function (interaction) {
                let poopy = this
                let { Discord } = poopy.modules

                return interaction.guild.channels.cache
                    .filter(c => c.type != Discord.ChannelType.GuildCategory &&
                        c.type != Discord.ChannelType.PublicThread &&
                        c.type != Discord.ChannelType.PrivateThread &&
                        c.type != Discord.ChannelType.AnnouncementThread &&
                        c.type != Discord.ChannelType.GuildDirectory &&
                        c.type != Discord.ChannelType.GuildForum &&
                        c.type != Discord.ChannelType.GuildMedia)
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(c => ({ name: c.name, value: c.id }))
            }
        },
        {
            "name": "threshold",
            "required": false,
            "specifarg": false,
            "orig": "{threshold}"
        },
        {
            "name": "emoji",
            "required": false,
            "specifarg": false,
            "orig": "{emoji}"
        }],
        "description": "Adds a new starboard with the specified threshold and emoji."
    },
    {
        "name": "edit",
        "args": [{
            "name": "starboardId",
            "required": true,
            "specifarg": false,
            "orig": "<starboardId>",
            "autocompvare": function (interaction) {
                var poopy = this
                return poopy.data.botData.starboards.filter(c => c.guildId == interaction.guild.id).map(c => c.id)
            }
        },
        {
            "name": "threshold",
            "required": false,
            "specifarg": false,
            "orig": "{threshold}"
        },
        {
            "name": "emoji",
            "required": false,
            "specifarg": false,
            "orig": "{emoji}"
        }],
        "description": "Edits the starboard config with the specified ID."
    },
    {
        "name": "delete",
        "args": [{
            "name": "starboardId",
            "required": true,
            "specifarg": false,
            "orig": "<starboardId>",
            "autocompvare": function (interaction) {
                var poopy = this
                return poopy.data.botData.starboards.filter(c => c.guildId == interaction.guild.id).map(c => c.id)
            }
        }],
        "description": "Deletes the starboard config from the server."
    }],
    execute: async function (msg, args) {
        var poopy = this
        var data = poopy.data
        var tempdata = poopy.tempdata
        var config = poopy.config
        var vars = poopy.vars
        var bot = poopy.bot
        var { chunkArray, navigateEmbed, generateId, fetchPingPerms } = poopy.functions
        var { DiscordTypes } = poopy.modules

        var options = {
            list: async (msg) => {
                var starboardsArray = []
                var serverStarboards = data.botData.starboards.filter(c => c.guildId == msg.guild.id)

                for (var i in serverStarboards) {
                    var starboard = serverStarboards[i]
                    starboardsArray.push(`- **ID:** ${starboard.id} | **Channel:** <#${starboard.channelId}> | **Threshold:** ${starboard.threshold} | **Emoji:** ${starboard.emoji}`)
                }

                if (starboardsArray.length <= 0) {
                    if (!msg.nosend) {
                        if (config.textEmbeds) await msg.reply('No starboards set up for this server.').catch(() => { })
                        else await msg.reply({
                            embeds: [{
                                "title": `Starboards for ${msg.guild.name}`,
                                "description": 'No starboards set up for this server.',
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
                    return 'No starboards set up for this server.'
                }

                var starboards = chunkArray(starboardsArray, 10)

                if (!msg.nosend) await navigateEmbed(
                    msg.channel, async (page) => {
                        if (config.textEmbeds) return `${starboards[page - 1].join('\n')}\n\nPage ${page}/${starboards.length}`
                        else return {
                            "title": `Starboards for ${msg.guild.name}`,
                            "description": starboards[page - 1].join('\n'),
                            "color": 0x472604,
                            "footer": {
                                "icon_url": bot.user.displayAvatarURL({
                                    dynamic: true, size: 1024, extension: 'png'
                                }),
                                "text": `Page ${page}/${starboards.length}`
                            },
                        }
                    },
                    starboards.length,
                    msg.member,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    msg
                )
                return `${starboards[0].join('\n')}\n\nPage 1/${starboards.length}`
            },

            info: async (msg, args) => {
                if (args[1] == undefined) {
                    await msg.reply('You gotta specify a starboard ID!').catch(() => { })
                    return
                }

                var starboardId = args[1]
                var starboard = data.botData.starboards.find(t => t.id === starboardId && t.guildId === msg.guild.id)

                if (starboard) {
                    if (!msg.nosend) {
                        if (config.textEmbeds) {
                            await msg.reply({
                                content: `**Channel:** <#${starboard.channelId}>\n**Threshold:** ${starboard.threshold}\n**Emoji:** ${starboard.emoji}`,
                                allowedMentions: fetchPingPerms(msg)
                            }).catch(() => { })
                        } else {
                            await msg.reply({
                                embeds: [{
                                    "title": `Starboard Info (ID: ${starboard.id})`,
                                    "description": `**Channel:** <#${starboard.channelId}>\n**Threshold:** ${starboard.threshold}\n**Emoji:** ${starboard.emoji}`,
                                    "color": 0x472604,
                                    "footer": {
                                        "icon_url": bot.user.displayAvatarURL({
                                            dynamic: true, size: 1024, extension: 'png'
                                        }),
                                        "text": bot.user.displayName
                                    },
                                }],
                                allowedMentions: fetchPingPerms(msg)
                            }).catch(() => { })
                        }
                    }
                    return `Starboard Info (ID: ${starboard.id})\nChannel: <#${starboard.channelId}>\n**Threshold:** ${starboard.threshold}\n**Emoji:** ${starboard.emoji}`
                } else {
                    await msg.reply(`No starboard found with that ID in this server.`).catch(() => { })
                    return
                }
            },

            add: async (msg, args) => {
                if (!(msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.ManageGuild)
                    || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.ManageMessages)
                    || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator)
                    || msg.author.id === msg.guild.ownerId
                    || config.ownerids.includes(msg.author.id))) {
                    await msg.reply('You need to be a moderator to execute that!').catch(() => { });
                    return;
                }

                let channel = msg.channel;

                let channelMatch = args[1] && args[1].match(/^<#(\d+)>$|^(\d{10,})$/)
                if (channelMatch) {
                    let id = channelMatch[1] || channelMatch[2];
                    let found = msg.guild.channels.cache.get(id);
                    if (!found) {
                        await msg.reply('Invalid channel.').catch(() => { });
                        return;
                    }
                    channel = found;
                    args.splice(1, 1);
                }

                let threshold = 3;
                if (args[1] && !isNaN(args[1])) {
                    threshold = Math.max(1, parseInt(args[1]));
                    args.splice(1, 1);
                }

                let emoji = "⭐";
                if (args[1]) {
                    let inputEmoji = args[1];

                    let discordEmojiRegex = /^<a?:[a-zA-Z0-9_]+:[0-9]+>$/;

                    if (
                        vars.emojiRegex.test(inputEmoji) ||
                        discordEmojiRegex.test(inputEmoji)
                    ) {
                        emoji = inputEmoji;

                        if (data.botData.starboards.find(s => s.channelId == channel.id && s.emoji == emoji)) {
                            await msg.reply('A starboard with that emoji already exists in the channel.').catch(() => { });
                            return;
                        }

                        args.splice(1, 1);
                    } else {
                        await msg.reply('Invalid emoji.').catch(() => { });
                        return;
                    }
                }

                let starboardId = generateId(data.botData.starboards.map(s => s.id));

                let newStarboard = {
                    id: starboardId,
                    guildId: msg.guild.id,
                    channelId: channel.id,
                    threshold,
                    emoji
                };

                data.botData.starboards.push(newStarboard)
                tempdata.starboards[starboardId] = {}

                if (!msg.nosend) {
                    await msg.reply(
                        `✅ Added starboard \`${starboardId}\` in <#${channel.id}>.\n` +
                        `-# **Threshold:** ${threshold}\n` +
                        `-# **Emoji:** ${emoji}`
                    ).catch(() => { });
                }

                return `✅ Added starboard \`${starboardId}\`.`;
            },


            edit: async (msg, args) => {
                if (!(msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.ManageGuild)
                    || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.ManageMessages)
                    || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator)
                    || msg.author.id === msg.guild.ownerId
                    || config.ownerids.includes(msg.author.id))) {
                    await msg.reply('You need to be a moderator to execute that!').catch(() => { });
                    return;
                }

                if (!args[1]) {
                    await msg.reply('You gotta specify a starboard ID!').catch(() => { });
                    return;
                }

                let starboardId = args[1];
                let starboard = data.botData.starboards.find(
                    s => s.id === starboardId && s.guildId === msg.guild.id
                );

                if (!starboard) {
                    await msg.reply('No starboard found with that ID in this server.').catch(() => { });
                    return;
                }

                let updates = [];

                if (args[2] && !isNaN(args[2])) {
                    let newThreshold = Math.max(1, parseInt(args[2]));
                    starboard.threshold = newThreshold;
                    updates.push(`threshold to **${newThreshold}**`);
                    args.splice(2, 1);
                }

                if (args[2]) {
                    let emojiInput = args[2];
                    let discordEmojiRegex = /^<a?:[a-zA-Z0-9_]+:[0-9]+>$/;

                    if (vars.emojiRegex.test(emojiInput) || discordEmojiRegex.test(emojiInput)) {
                        starboard.emoji = emojiInput;

                        if (data.botData.starboards.find(s => s.channelId == starboard.channelId && s.emoji == emojiInput)) {
                            await msg.reply('A starboard with that emoji already exists in the channel.').catch(() => { });
                            return;
                        }

                        updates.push(`emoji to **${emojiInput}**`);
                    } else {
                        await msg.reply('Invalid emoji.').catch(() => { });
                        return;
                    }
                }

                if (updates.length === 0) {
                    await msg.reply('No updates provided.').catch(() => { });
                    return;
                }

                if (!msg.nosend) {
                    await msg.reply(
                        `✅ Updated starboard \`${starboardId}\`. (${updates.join(" and ")})`
                    ).catch(() => { });
                }

                return `✅ Updated starboard \`${starboardId}\`.`;
            },

            delete: async (msg, args) => {
                if (!(msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.ManageGuild)
                    || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.ManageMessages)
                    || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator)
                    || msg.author.id === msg.guild.ownerId
                    || config.ownerids.includes(msg.author.id))) {
                    await msg.reply('You need to be a moderator to execute that!').catch(() => { });
                    return;
                }

                if (!args[1]) {
                    await msg.reply('You gotta specify a starboard ID!').catch(() => { });
                    return;
                }

                let starboardId = args[1];
                let index = data.botData.starboards.findIndex(
                    s => s.id === starboardId && s.guildId === msg.guild.id
                );

                if (index === -1) {
                    await msg.reply('No starboard found with that ID in this server.').catch(() => { });
                    return;
                }

                let removed = data.botData.starboards.splice(index, 1)[0];
                delete tempdata.starboards[starboardId];

                if (!msg.nosend) {
                    await msg.reply(
                        `✅ Removed starboard \`${removed.id}\` assigned to <#${removed.channelId}>.`
                    ).catch(() => { });
                }

                return `✅ Removed starboard \`${removed.id}\`.`;
            }
        }

        if (!args[1]) {
            var instruction = "**list** - Gets a list of starboards set up in the server.\n" +
                "**info** <starboardId> - Displays the info of the starboard that has been set up with the respective ID.\n" +
                "**add** [channel] {threshold} {emoji} (moderator only) - Sets up a new starboard with the specified threshold and emoji.\n" +
                "**edit** <starboardId> {threshold} {emoji} (moderator only) - Edits the starboard config with the specified ID, if it exists.\n" +
                "**delete** <starboardId> (moderator only) - Deletes the starboard config from the server, if it exists."
            if (!msg.nosend) {
                if (config.textEmbeds) msg.reply(instruction).catch(() => { })
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
        name: 'starboard <option>',
        value: 'Allows you to set up custom starboards your server! Use the command alone for more info.'
    },
    cooldown: 2500,
    type: 'Unique'
}