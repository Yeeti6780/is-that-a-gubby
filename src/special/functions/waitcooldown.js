module.exports = {
  helpf: '()',
  desc: 'Waits your current cooldown value.',
  func: async function (_, msg) {
    let poopy = this
    let data = poopy.data
    let tempdata = poopy.tempdata
    let { sleep } = poopy.functions
    
    var userData = data.guildData[msg.guild.id].members[msg.author.id]
    
    var currentCooldown
    while (
        (currentCooldown = (userData.coolDown || 0) - Date.now()) > 0
    ) {
    	tempdata[msg.author.id][msg.id].keyAttempts += currentCooldown
        await sleep(currentCooldown)
    }
    
    return ''
  }
}