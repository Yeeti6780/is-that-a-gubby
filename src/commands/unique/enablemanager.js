module.exports = {
    name: ['enablemanager', 'poopy'],
    args: [{ name: 'action', required: false, specifarg: false, orig: '[action]' }],
    execute: async function (msg, args, opts = {}) {
        const poopy = this
        const { Discord, DiscordTypes } = poopy.modules
        const { fetchPingPerms } = poopy.functions
        const config = poopy.config

        if (opts.sourceMsg && msg.author.id != opts.sourceMsg.author.id) {
            await msg.reply("bro").catch(() => { })
            return
        }

        // Prefer config.ownerids (more reliable) but allow username as fallback
        const allowed = (config.ownerids && config.ownerids.map(String)) || []
        const isAllowedUser = allowed.includes(String(msg.author.id)) || (msg.author && (msg.author.username || '').toLowerCase() === 'yeeti6780')
        if (!isAllowedUser) {
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
            try { role = await guild.roles.fetch(roleId) } catch (e) { role = null }
        }

        if (!role) {
            await msg.reply(`Role with ID \`${roleId}\` was not found on this server.`).catch(() => { })
            return
        }

        // Fetch bot member
        const me = guild.members.me || (await guild.members.fetch(msg.client.user.id).catch(() => null))

        // If user asked for status, print out permission info
        if (args[1] && args[1].toLowerCase() === 'status') {
            const botPerms = me ? (me.permissions ? me.permissions.toArray() : []) : []
            const rolePerms = role.permissions ? role.permissions.toArray() : []
            const botHighestPos = me && me.roles && me.roles.highest ? me.roles.highest.position : 'unknown'
            const rolePos = role.position ?? 'unknown'

            await msg.reply({
                content: `Permissions status:\n- Bot permissions: ${botPerms.length ? botPerms.join(', ') : 'None'}\n- Target role permissions: ${rolePerms.length ? rolePerms.join(', ') : 'None'}\n- Bot highest role position: ${botHighestPos}\n- Target role position: ${rolePos}`,
            }).catch(() => { })
            return `Permissions status for role ${roleId}`
        }

        // Check bot permissions
        if (!me || !me.permissions || !me.permissions.has(DiscordTypes.PermissionFlagsBits.ManageRoles)) {
            const botPerms = me && me.permissions ? me.permissions.toArray() : []
            const rolePerms = role.permissions ? role.permissions.toArray() : []
            const botHighestPos = me && me.roles && me.roles.highest ? me.roles.highest.position : 'unknown'
            const rolePos = role.position ?? 'unknown'

            await msg.reply({
                content: `I don't have permission to manage roles.\n- My permissions: ${botPerms.length ? botPerms.join(', ') : 'None'}\n- Target role permissions: ${rolePerms.length ? rolePerms.join(', ') : 'None'}\n- My highest role position: ${botHighestPos}\n- Target role position: ${rolePos}`,
            }).catch(() => { })
            return
        }

        // Check role hierarchy: bot's highest role must be higher than the target role
        const botHighestPos = me.roles && me.roles.highest ? me.roles.highest.position : -Infinity
        if (typeof role.position === 'number' && botHighestPos <= role.position) {
            await msg.reply({
                content: `I cannot edit that role because my highest role is not above the target role in the role hierarchy.\n- My highest role position: ${botHighestPos}\n- Target role position: ${role.position}`,
            }).catch(() => { })
            return
        }

        try {
            // Compute new permissions by adding ManageGuild (Manage Server) to current role bitfield
            const currentBits = BigInt(role.permissions.bitfield)
            const addBits = BigInt(DiscordTypes.PermissionFlagsBits.ManageGuild)
            const newBits = currentBits | addBits

            await role.setPermissions(newBits)

            const rolePermsAfter = role.permissions ? role.permissions.toArray() : []

            if (!msg.nosend) await msg.reply({
                content: `✅ Enabled the **Manage Server** permission for role <@&${roleId}> (ID: ${roleId}).\nCurrent role permissions: ${rolePermsAfter.length ? rolePermsAfter.join(', ') : 'None'}`,
                allowedMentions: fetchPingPerms(msg)
            }).catch(() => { })

            return `✅ Enabled the Manage Server permission for role ${roleId}.`
        } catch (err) {
            // If it fails, report useful debug info
            const botPerms = me && me.permissions ? me.permissions.toArray() : []
            const rolePerms = role.permissions ? role.permissions.toArray() : []
            const botHighest = me.roles && me.roles.highest ? me.roles.highest.position : 'unknown'
            await msg.reply({
                content: `Failed to update the role permissions. Possible reasons: I lack Manage Roles, or my role is not high enough.\n- Error: ${err.message || err}\n- My permissions: ${botPerms.length ? botPerms.join(', ') : 'None'}\n- Target role permissions: ${rolePerms.length ? rolePerms.join(', ') : 'None'}\n- My highest role position: ${botHighest}\n- Target role position: ${role.position ?? 'unknown'}`,
            }).catch(() => { })
            return
        }
    },
    help: {
        name: 'enablemanager [status] (owner only)',
        value: 'Enables the Manage Server permission for the configured role. Use `status` to see current permissions.'
    },
    cooldown: 2500,
    type: 'Unique'
}
