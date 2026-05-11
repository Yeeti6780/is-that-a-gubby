module.exports = {
  name: ['chaincommands'],
  args: [],
  execute: async function (msg, _, opts) {
    let poopy = this
    let config = poopy.config
    let data = poopy.data
    let { DiscordTypes } = poopy.modules

    if (opts.sourceMsg && msg.author.id != opts.sourceMsg.author.id) {
      await msg.reply("bro").catch(() => { })
      return
    }

    if (msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageGuild) || msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageMessages) || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) || msg.author.id === msg.guild.ownerId || config.ownerids.find(id => id == msg.author.id)) {
      data.guildData[msg.guild.id].chaincommands = !data.guildData[msg.guild.id].chaincommands
      if (!msg.nosend) await msg.reply('Set to **' + data.guildData[msg.guild.id].chaincommands + '**.').catch(() => { })
      return 'Set to **' + data.guildData[msg.guild.id].chaincommands + '**.'
    } else {
      await msg.reply('You need to be a moderator to execute that!').catch(() => { })
      return;
    };
  },
  help: {
    name: 'chaincommands (moderator only)',
    value: "Enable or disable the ability to chain commands, if you don't want the chat to get spammy of course."
  },
  cooldown: 5000,
  perms: ['Administrator'],
  type: 'Settings'
}