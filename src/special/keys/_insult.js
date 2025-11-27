const insults = [
    'stupid',
    'bastard',
    'retard',
    'idiot',
    'buffoon',
    'moron',
    'lazy',
    'bad',
    'weak',
    'unkind',
    'dumb',
    'bitch',
    'worthless',
    'unfunny',
    'trash',
    'dumbass',
    'asshole',
    'motherfucker',
    'jerk',
    'dunce',
    'dork',
    'jackass',
    'cretin',
    'dipshit',
    'cow',
    'fucker',
    'imbecile',
    'clown',
    'toxic',
    'pinhead',
    'twat',
    'pig',
    'donkey',
    'dweeb',
    'honky',
    'rat',
    'scumbag',
    'twit',
    'weirdo',
    'gay'
]

module.exports = {
    desc: 'Returns a random insult.', func: function () {
        let poopy = this

        return insults[Math.floor(Math.random() * insults.length)]
    },
    array: insults,
    cmdconnected: 'cah'
}