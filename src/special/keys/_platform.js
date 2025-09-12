var platforms = [
    'Android', 'iOS', 'Windows', 'macOS', 'Linux',
    'Xbox', 'Xbox 360', 'Xbox One', 'Xbox Series X', 'Xbox Series S',
    'PS1', 'PS2', 'PS3', 'PS4', 'PS5', 'PSP', 'PS Vita',
    'Nintendo NES', 'SNES', 'Nintendo 64', 'Gamecube',
    'Wii', 'Wii U', 'Nintendo Switch', 'Nintendo Switch 2',
    'Nintendo DS', 'Nintendo 2DS', 'Nintendo 3DS',
    'Gameboy', 'Gameboy Color', 'Gameboy Advance',
    'Sega Master System', 'Sega Genesis', 'Sega CD', 'Sega 32X',
    'Sega Saturn', 'Sega Dreamcast', 'Sega Game Gear',
    'Atari 2600', 'Atari 5200', 'Atari 7800', 'Atari Jaguar', 'Atari Lynx',
    'Neo Geo AES', 'Neo Geo MVS', 'Neo Geo CD', 'Neo Geo Pocket', 'Neo Geo Pocket Color',
    'TurboGrafx-16', 'PC Engine', 'TurboExpress',
    'Intellivision', 'ColecoVision', 'Magnavox Odyssey',
    'Commodore 64', 'Amiga', 'Atari ST', 'Apple II',
    'MS-DOS',
    'Virtual Boy',
    'Playdate',
    'WonderSwan', 'WonderSwan Color',
    'Analogue Pocket',
    'Steam Deck',
    'VR Headset', 'PlayStation VR', 'PlayStation VR2'
]

module.exports = {
    desc: 'Returns a random platform.',
    func: function () {
        return platforms[Math.floor(Math.random() * platforms.length)]
    },
    array: platforms
}