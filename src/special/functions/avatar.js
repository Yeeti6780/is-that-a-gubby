module.exports = {
  helpf: '(id | global)',
  desc: 'Fetches the avatar of the user with the specified ID.',
  func: async function (matches, msg) {
    let poopy = this
    let bot = poopy.bot
    let { splitKeyFunc } = poopy.functions

    var word = matches[1]
    var [id, global] = splitKeyFunc(word, { args: 2 })

    var user = await msg.guild.members.fetch(id).catch(() => { }) ??
      await bot.users.fetch(id).catch(() => { })

    if (global && user?.user) user = user.user

    return user ? user.displayAvatarURL({ dynamic: true, size: 1024, extension: 'png' }) : ''
  }
}