const mongoose = require('mongoose')
const schemas = require('./schemas')

let connected = false

// Object to store promises for currently fetching data
const pendingFetches = {
    botData: new Map(),
    userData: new Map(),
    guildData: new Map(),
    channelData: new Map(),
    allChannelData: new Map(),
    memberData: new Map(),
    allMemberData: new Map(),
    globalData: new Map()
}

async function withRaceConditionProtection(type, key, fetchFunction) {
    if (pendingFetches[type].has(key)) {
        return pendingFetches[type].get(key)
    }

    const promise = fetchFunction()
    pendingFetches[type].set(key, promise)

    try {
        const result = await promise
        return result
    } finally {
        pendingFetches[type].delete(key)
    }
}

module.exports = {
    botData: async (dataid) => {
        const key = dataid
        
        return withRaceConditionProtection('botData', key, async () => {
            var botData = {}

            var url = process.env.MONGODB_URL
            if (!connected) {
                connected = true
                await mongoose.connect(url)
            }

            var dataobject = await schemas.botData.findOne({ dataid }).then(d => d?.toJSON()).catch(() => { })

            if (dataobject) {
                for (var k in dataobject) {
                    var value = dataobject[k]
                    if ((schemas.botData.schema.obj[k] ?? { required: true }).required) continue
                    botData[k] = value
                }
            }

            return botData
        })
    },

    userData: async (dataid, uid) => {
        const key = getCacheKey(dataid, uid)
        
        return withRaceConditionProtection('userData', key, async () => {
            var userData = {}

            var url = process.env.MONGODB_URL
            if (!connected) {
                connected = true
                await mongoose.connect(url)
            }

            var dataobject = await schemas.userData.findOne({ dataid, uid }).then(d => d?.toJSON()).catch(() => { })

            if (dataobject) {
                for (var k in dataobject) {
                    var value = dataobject[k]
                    if ((schemas.userData.schema.obj[k] ?? { required: true }).required) continue
                    userData[k] = value
                }
            }

            return userData
        })
    },

    guildData: async (dataid, gid) => {
        const key = getCacheKey(dataid, gid)
        
        return withRaceConditionProtection('guildData', key, async () => {
            var guildData = {}

            var url = process.env.MONGODB_URL
            if (!connected) {
                connected = true
                await mongoose.connect(url)
            }

            var dataobject = await schemas.guildData.findOne({ dataid, gid }).then(d => d?.toJSON()).catch(() => { })

            if (dataobject) {
                for (var k in dataobject) {
                    var value = dataobject[k]
                    if ((schemas.guildData.schema.obj[k] ?? { required: true }).required) continue
                    guildData[k] = value
                }
            }

            return guildData
        })
    },

    channelData: async (dataid, gid, cid) => {
        const key = getCacheKey(dataid, gid, cid)
        
        return withRaceConditionProtection('channelData', key, async () => {
            var channelData = {}

            var url = process.env.MONGODB_URL
            if (!connected) {
                connected = true
                await mongoose.connect(url)
            }

            var dataobject = await schemas.channelData.findOne({ dataid, gid, cid }).then(d => d?.toJSON()).catch(() => { })

            if (dataobject) {
                for (var k in dataobject) {
                    var value = dataobject[k]
                    if ((schemas.channelData.schema.obj[k] ?? { required: true }).required) continue
                    channelData[k] = value
                }
            }

            return channelData
        })
    },

    allChannelData: async (dataid, gid) => {
        const key = getCacheKey(dataid, gid)
        
        return withRaceConditionProtection('allChannelData', key, async () => {
            var channelData = {}

            var url = process.env.MONGODB_URL
            if (!connected) {
                connected = true
                await mongoose.connect(url)
            }

            var dataobjects = await schemas.channelData.find({ dataid, gid }).then(arr => arr.map(d => d.toJSON())).catch(() => { })

            if (dataobjects) {
                for (var dataobject of dataobjects) {
                    var cid = dataobject.cid
                    channelData[cid] = {}
                    for (var k in dataobject) {
                        var value = dataobject[k]
                        if ((schemas.channelData.schema.obj[k] ?? { required: true }).required) continue
                        channelData[cid][k] = value
                    }
                }
            }

            return channelData
        })
    },

    memberData: async (dataid, gid, uid) => {
        const key = getCacheKey(dataid, gid, uid)
        
        return withRaceConditionProtection('memberData', key, async () => {
            var memberData = {}

            var url = process.env.MONGODB_URL
            if (!connected) {
                connected = true
                await mongoose.connect(url)
            }

            var dataobject = await schemas.memberData.findOne({ dataid, gid, uid }).then(d => d?.toJSON()).catch(() => { })

            if (dataobject) {
                for (var k in dataobject) {
                    var value = dataobject[k]
                    if ((schemas.memberData.schema.obj[k] ?? { required: true }).required) continue
                    memberData[k] = value
                }
            }

            return memberData
        })
    },

    allMemberData: async (dataid, gid) => {
        const key = getCacheKey(dataid, gid)
        
        return withRaceConditionProtection('allMemberData', key, async () => {
            var memberData = {}

            var url = process.env.MONGODB_URL
            if (!connected) {
                connected = true
                await mongoose.connect(url)
            }

            var dataobjects = await schemas.memberData.find({ dataid, gid }).then(arr => arr.map(d => d.toJSON())).catch(() => { })

            if (dataobjects) {
                for (var dataobject of dataobjects) {
                    var uid = dataobject.uid
                    memberData[uid] = {}
                    for (var k in dataobject) {
                        var value = dataobject[k]
                        if ((schemas.memberData.schema.obj[k] ?? { required: true }).required) continue
                        memberData[uid][k] = value
                    }
                }
            }

            return memberData
        })
    },

    globalData: async () => {
        const key = 'global'
        
        return withRaceConditionProtection('globalData', key, async () => {
            var globalData = {}

            var url = process.env.MONGODB_URL
            if (!connected) {
                connected = true
                await mongoose.connect(url)
            }

            var dataobject = await schemas.globalData.findOne({}).then(d => d?.toJSON()).catch(() => { })

            if (dataobject) {
                for (var k in dataobject) {
                    var value = dataobject[k]
                    if ((schemas.globalData.schema.obj[k] ?? { required: true }).required) continue
                    globalData[k] = value
                }
            }

            return globalData
        })
    },

    update: async (dataid, d) => {
        var url = process.env.MONGODB_URL
        if (!connected) {
            connected = true
            await mongoose.connect(url)
        }

        const data = d.data

        const botData = data.botData
        if (botData) {
            try {
                await schemas.botData.findOneAndUpdate(
                    { dataid },
                    botData,
                    { upsert: true }
                )
            } catch (err) {
                console.error("Failed to update botData:", err)
            }
        }

        const userData = data.userData || {}
        const userOps = Object.entries(userData).map(([uid, user]) => ({
            updateOne: {
                filter: { dataid, uid },
                update: user,
                upsert: true
            }
        }))
        if (userOps.length > 0) {
            try {
                await schemas.userData.bulkWrite(userOps)
            } catch (err) {
                console.error("Failed to update userData:", err)
            }
        }

        const guildData = data.guildData || {}
        for (const [gid, guild] of Object.entries(guildData)) {
            const { channels = {}, members = {}, ...guildInfo } = guild

            const guildUpdate = schemas.guildData.findOneAndUpdate(
                { dataid, gid },
                guildInfo,
                { upsert: true }
            )

            const channelOps = Object.entries(channels).map(([cid, channel]) => ({
                updateOne: {
                    filter: { dataid, gid, cid },
                    update: channel,
                    upsert: true
                }
            }))

            const memberOps = Object.entries(members).map(([uid, member]) => ({
                updateOne: {
                    filter: { dataid, gid, uid },
                    update: member,
                    upsert: true
                }
            }))

            try {
                await Promise.all([
                    guildUpdate,
                    channelOps.length > 0 ? schemas.channelData.bulkWrite(channelOps) : null,
                    memberOps.length > 0 ? schemas.memberData.bulkWrite(memberOps) : null
                ])
            } catch (err) {
                console.error(`Failed to update guild ${gid}:`, err)
            }
        }

        const globaldata = d.globaldata
        if (globaldata) {
            try {
                await schemas.globalData.findOneAndUpdate({}, globaldata, { upsert: true })
            } catch (err) {
                console.error("Failed to update globalData:", err)
            }
        }
    }
}
