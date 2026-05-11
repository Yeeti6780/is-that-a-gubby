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

function generateText(model, minLength = 1, maxLength = 2000, keySize = 1, begin = "") {
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
        let possibilities = model.keywords.get(key);

        if (!possibilities || !possibilities.length) {
            if (result.length >= minLength) break;

            currentKey = Array(keySize).fill(START);
            possibilities = model.keywords.get(currentKey.join("|"));

            if (!possibilities || !possibilities.length) break;
        }

        let nextWord = sample(possibilities);

        if (nextWord === END && result.length < minLength) {
            currentKey = Array(keySize).fill(START);
            possibilities = model.keywords.get(currentKey.join("|"));

            if (!possibilities || !possibilities.length) break;

            nextWord = sample(possibilities);

            let safety = 10;
            while (nextWord === END && safety-- > 0) {
                nextWord = sample(possibilities);
            }

            if (nextWord === END) break;
        }

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

function trainSample(sample, model, keySize = 1) {
    const words = sample
        .split(/\s+/)
        .filter(Boolean)
        .map(wordProcess);

    if (!words.length) return;

    const window = Array(keySize).fill(START);
    const operations = [];

    for (let i = 0; i <= words.length; i++) {
        const next = i === words.length ? END : words[i];

        const key = window.join("|");

        let arr = model.keywords.get(key);

        let created = false;

        if (arr === undefined) {
            arr = [];
            model.keywords.set(key, arr);
            created = true;
        }

        arr.push(next);

        operations.push({
            key,
            next,
            created
        });

        for (let j = 0; j < keySize - 1; j++) {
            window[j] = window[j + 1];
        }

        window[keySize - 1] = next;
    }

    return operations;
}

function undoTrainSample(operations, model) {
    for (let i = operations.length - 1; i >= 0; i--) {
        const op = operations[i];

        const arr = model.keywords.get(op.key);
        if (!arr) continue;

        const idx = arr.lastIndexOf(op.next);

        if (idx !== -1) {
            arr.splice(idx, 1);
        }

        if (arr.length === 0) {
            model.keywords.delete(op.key);
        }
    }
}

function buildModel(samples, keySize = 1) {
    const model = {
        keywords: new Map(),
        undo: new Map()
    }

    for (const sample of samples) {
        const operations = trainSample(sample, model);
        if (operations) model.undo.set(sample.toLowerCase(), operations);
    }

    return model;
}

function generateFromModel(model, {
    minLength = 1,
    maxLength = 1500,
    keySize = 1,
    attempts = 5,
    begin = "",
    count = 1
} = {}) {
    function generateAttempt() {
        for (let i = 0; i < attempts; i++) {
            const res = generateText(model, minLength, maxLength, keySize, begin);
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
    buildModel,
    trainSample,
    undoTrainSample
}
