const { parentPort, workerData } = require("worker_threads")

const { action, args } = workerData

function startGenAIWorker() {
    const genAi = require("./genai");

    const [samples] = args;
    const model = genAi.buildModel(samples);

    parentPort.on("message", async (msg) => {
        const { id, action, args } = msg;

        try {
            let result;

            switch (action) {
                case "generate":
                    result = genAi.generateFromModel(model, args[0]);
                    break;

                case "train": {
                    const sample = args[0];

                    const operations = genAi.trainSample(sample, model);

                    if (operations) {
                        model.undo.set(sample.toLowerCase(), operations);
                    }

                    result = true;
                    break;
                }

                case "undo": {
                    const sample = args[0];

                    const operations = model.undo.get(sample.toLowerCase());
                    if (operations) genAi.undoTrainSample(operations, model);

                    result = true;
                    break;
                }

                default:
                    throw new Error(`Unknown action: ${action}`);
            }

            parentPort.postMessage({
                id,
                result
            });

        } catch (err) {
            parentPort.postMessage({
                id,
                error: err.stack
            });
        }
    });
}

async function main() {
    switch (action) {
        case "genai":
            startGenAIWorker();
            break;

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