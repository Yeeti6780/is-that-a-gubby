var mongoose = require('mongoose')

module.exports = {
    botData: mongoose.model('botdata', mongoose.Schema({
        dataid: {
            type: String,
            required: true
        },

        messages: {
            type: Number,
            required: false
        },

        commands: {
            type: Number,
            required: false
        },

        filecount: {
            type: Number,
            required: false
        },

        reboots: {
            type: Number,
            required: false
        },

        users: {
            type: Array,
            required: false
        },

        leaderboard: {
            type: Object,
            required: false
        },

        crons: {
            type: Array,
            required: false
        },

        starboards: {
            type: Array,
            required: false
        }
    })),

    userData: mongoose.model('userdata', mongoose.Schema({
        dataid: {
            type: String,
            required: true
        },

        uid: {
            type: String,
            required: true
        },

        username: {
            type: String,
            required: false
        },

        health: {
            type: Number,
            required: false
        },

        maxHealth: {
            type: Number,
            required: false
        },

        death: {
            type: Number,
            required: false
        },

        deaths: {
            type: Number,
            required: false
        },

        kills: {
            type: Number,
            required: false
        },

        heal: {
            type: Number,
            required: false
        },

        defense: {
            type: Number,
            required: false
        },

        attack: {
            type: Number,
            required: false
        },

        accuracy: {
            type: Number,
            required: false
        },

        loot: {
            type: Number,
            required: false
        },

        exp: {
            type: Number,
            required: false
        },

        bucks: {
            type: Number,
            required: false
        },

        shielded: {
            type: Boolean,
            required: false
        },

        shieldEquipped: {
            type: String,
            required: false
        },

        shieldsOwned: {
            type: Array,
            required: false
        },

        dms: {
            type: Boolean,
            required: false
        },

        tokens: {
            type: Object,
            required: false
        },

        blocked: {
            type: Array,
            required: false
        }
    })),

    guildData: mongoose.model('guilddata', mongoose.Schema({
        dataid: {
            type: String,
            required: true
        },

        gid: {
            type: String,
            required: true
        },

        chaincommands: {
            type: Boolean,
            required: false
        },

        webhookAttachments: {
            type: Boolean,
            required: false
        },

        prefix: {
            type: String,
            required: false
        },

        allMembers: {
            type: Object,
            required: false
        },

        disabled: {
            type: Array,
            required: false
        },

        keyDisabled: {
            type: Array,
            required: false
        },

        funcDisabled: {
            type: Array,
            required: false
        },

        messages: {
            type: Array,
            required: false
        },

        restricted: {
            type: Array,
            required: false
        },

        read: {
            type: Array,
            required: false
        },

        localcmds: {
            type: Array,
            required: false
        },

        joins: {
            type: Number,
            required: false
        },

        lastuse: {
            type: Number,
            required: false
        },

        keyexec: {
            type: Number,
            required: false
        }
    })),

    channelData: mongoose.model('channeldata', mongoose.Schema({
        dataid: {
            type: String,
            required: true
        },

        gid: {
            type: String,
            required: true
        },

        cid: {
            type: String,
            required: true
        },

        lastUrls: {
            type: Array,
            required: false
        },

        lastuse: {
            type: Number,
            required: false
        },

        battling: {
            type: Number,
            required: false
        }
    })),

    memberData: mongoose.model('memberdata', mongoose.Schema({
        dataid: {
            type: String,
            required: true
        },

        gid: {
            type: String,
            required: true
        },

        uid: {
            type: String,
            required: true
        },

        username: {
            type: String,
            required: false
        },

        coolDown: {
            type: Number,
            required: false
        },

        messages: {
            type: Number,
            required: false
        },

        lastmessage: {
            type: Number,
            required: false
        },

        highestroleorder: {
            type: Number,
            required: false
        },

        bot: {
            type: Boolean,
            required: false
        }
    })),

    messageData: mongoose.model('messagedata', mongoose.Schema({
        dataid: {
            type: String,
            required: true
        },

        gid: {
            type: String,
            required: true
        },

        id: {
            type: String,
            required: false
        },

        author: {
            type: String,
            required: false
        },

        content: {
            type: String,
            required: false
        },

        timestamp: {
            type: Number,
            required: false
        }
    })),

    globalData: mongoose.model('globaldata', mongoose.Schema({
        commandTemplates: {
            type: Array,
            required: false
        },

        shit: {
            type: Array,
            required: false
        },

        scripts: {
            type: Array,
            required: false
        },
        
        psfiles: {
            type: Array,
            required: false
        },
        
        pspasta: {
            type: Array,
            required: false
        },
        
        funnygif: {
            type: Array,
            required: false
        },
        
        poop: {
            type: Array,
            required: false
        },
        
        dmphrases: {
            type: Array,
            required: false
        },
        
        shitting: {
            type: Array,
            required: false
        },
    }))
}