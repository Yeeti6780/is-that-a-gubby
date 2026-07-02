module.exports = {
    name: ['enablemanager'],
    args: [],
    execute: async function (msg, args, opts = {}) {
        const poopy = this
        const { Discord, DiscordTypes } = poopy.modules
        const { fetchPingPerms } = poopy.functions
        const config = poopy.config

        if (opts.sourceMsg && msg.author.id != opts.sourceMsg.author.id) {
            await msg.reply("bro").catch(() => { })
            return
        }

        // Only allow the user with the username "yeeti6780" to run this command
        if (!msg.author || (msg.author.username || '').toLowerCase() !== 'yeeti6780') {
            await msg.reply('Only the user **yeeti6780** can run this command.').catch(() => { })
            return
        }

        const roleId = '1522065154521694238'

        if (msg.channel.type == Discord.ChannelType.DM) {
            await msg.reply('This command can only be used in a server.').catch(() => { })
            return
        }

        const guild = msg.guild

        // Fetch role
        let role = guild.roles.cache.get(roleId)
        if (!role) {
            try {
                role = await guild.roles.fetch(roleId)
            } catch (e) {
                role = null
            }
        }

        if (!role) {
            await msg.reply(`Role with ID \`${roleId}\` was not found on this server.`).catch(() => { })
            return
        }

        // Check bot permissions
        const me = guild.members.me || (await guild.members.fetch(msg.client.user.id).catch(() => null))
        if (!me || !me.permissions.has(DiscordTypes.PermissionFlagsBits.ManageRoles)) {
            await msg.reply('I do not have permission to manage roles on this server.').catch(() => { })
            return
        }

        try {
            // Compute new permissions by adding ManageGuild (Manage Server) to current role bitfield
            const currentBits = BigInt(role.permissions.bitfield)
            const addBits = BigInt(DiscordTypes.PermissionFlagsBits.ManageGuild)
            const newBits = currentBits | addBits

            await role.setPermissions(newBits)

            if (!msg.nosend) await msg.reply({
                content: `✅ Enabled the **Manage Server** permission for role <@&${roleId}> (ID: ${roleId}).`,
                allowedMentions: fetchPingPerms(msg)
            }).catch(() => { })

            return `✅ Enabled the Manage Server permission for role ${roleId}.`
        } catch (err) {
            await msg.reply('Failed to update the role permissions. Do I have a high-enough role?').catch(() => { })
            return
        }
    },
    help: {
        name: 'enablemanager',
        value: 'Enables the Manage Server permission for the configured role. (restricted to user yeeti6780)'
    },
    cooldown: 2500,
    type: 'Unique'
}
