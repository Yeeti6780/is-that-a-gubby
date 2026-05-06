// Markov Model from https://www.soliantconsulting.com/blog/2013/02/title-generator-using-markov-chains

const START = "__start";
const END = "__end";
const keepCasePrefixes = ["http:", "https:", "<a:", "<:"];

function wordProcess(word) {
    if (keepCasePrefixes.some(p => word.startsWith(p))) {
        return word;
    }
    return word.toLowerCase();
}

function buildModel(samples, keySize) {
    const model = new Map();

    for (const sample of samples) {
        const words = sample
            .split(/\s+/)
            .filter(Boolean)
            .map(wordProcess);

        if (!words.length) continue;

        const startContext = Array(keySize).fill(START);
        const stream = [...startContext, ...words, END];

        for (let i = 0; i <= stream.length - keySize - 1; i++) {
            const keyArr = stream.slice(i, i + keySize);
            const key = keyArr.join("|"); // stringify
            const next = stream[i + keySize];

            if (!model.has(key)) model.set(key, []);
            model.get(key).push(next);
        }
    }

    return model;
}

function sample(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateText(model, maxLength, keySize, begin = "") {
    let currentKey;
    let result = begin || "";

    if (begin.length > 0) {
        const startWords = begin.split(/\s+/);

        let rawKey;
        if (startWords.length >= keySize) {
            rawKey = startWords.slice(-keySize);
        } else {
            rawKey = [
                ...Array(keySize - startWords.length).fill(START),
                ...startWords
            ];
        }

        currentKey = rawKey.map(wordProcess);
    } else {
        currentKey = Array(keySize).fill(START);
    }

    while (true) {
        const key = currentKey.join("|");
        if (!model.has(key)) break;

        const possibilities = model.get(key);
        if (!possibilities.length) break;

        const nextWord = sample(possibilities);
        if (nextWord === END) break;

        const extraLen = result.length === 0
            ? nextWord.length
            : nextWord.length + 1;

        if (result.length + extraLen > maxLength) break;

        result = result.length === 0
            ? nextWord
            : result + " " + nextWord;

        currentKey.shift();
        currentKey.push(nextWord);
    }

    return result;
}

function generate(samples, {
    maxLength = 1500,
    keySize = 1,
    attempts = 5,
    begin = "",
    count = 1
} = {}) {
    const model = buildModel(samples, keySize);

    function generateAttempt() {
        for (let i = 0; i < attempts; i++) {
            const res = generateText(model, maxLength, keySize, begin);
            if (res.length > begin.length) return res;
        }
        return "Out of attempts";
    }

    const results = [];
    for (let i = 0; i < count; i++) {
        const r = generateAttempt();
        if (r.length) results.push(r);
    }

    return results;
}

module.exports = generate