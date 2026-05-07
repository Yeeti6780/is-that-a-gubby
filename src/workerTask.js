const { parentPort, workerData } = require("worker_threads")

const { action, args } = workerData

async function main() {
    switch (action) {
        case "genai-generate": {
            const genAi = require("./genai")
            const result = genAi.generateFromModel(...args)
            return parentPort.postMessage(result)
        }
    
        case "genai-model": {
            const genAi = require("./genai")
            const result = genAi.buildModel(...args)
            return parentPort.postMessage(result)
        }
    
        case "spectrogram": {
            const spectrogram = require("./spectrogram")
            const result = await spectrogram(...args)
            return parentPort.postMessage(result)
        }

        case "decrypt-messages": {
            const { decrypt } = require("./functions")
            const [messages] = args
            const result = messages.map((m => ({ ...m, content: decrypt(m.content) })))
            return parentPort.postMessage(result)
        }
    }
}

main()