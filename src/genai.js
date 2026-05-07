// Generator Model from https://gitlab.com/genai-bot/generator-service

const START = "__start";
const END = "__end";
const keepCasePrefixes = ["http:", "https:", "<a:", "<:"];

function wordProcess(word) {
    if (keepCasePrefixes.some(p => word.startsWith(p))) {
        return word;
    }
    return word.toLowerCase();
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

function buildModel(samples, keySize = 1) {
    const model = new Map();

    for (const sample of samples) {
        const words = sample
            .split(/\s+/)
            .filter(Boolean)
            .map(wordProcess);

        if (!words.length) continue;

        const window = Array(keySize).fill(START);

        for (let i = 0; i <= words.length; i++) {
            const next = i === words.length ? END : words[i];

            const key = window.join("|");

            let arr = model.get(key);
            if (arr === undefined) {
                arr = [];
                model.set(key, arr);
            }

            arr.push(next);

            for (let j = 0; j < keySize - 1; j++) {
                window[j] = window[j + 1];
            }

            window[keySize - 1] = next;
        }
    }

    return model;
}

function generateFromModel(model, {
    maxLength = 1500,
    keySize = 1,
    attempts = 5,
    begin = "",
    count = 1
} = {}) {
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

function generate(samples, opts = {}) {
    const model = buildModel(samples, opts.keySize ?? 1);

    return generateFromModel(model, opts);
}

module.exports = {
    generate,
    generateFromModel,
    buildModel
}