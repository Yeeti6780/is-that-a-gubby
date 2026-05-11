const { Worker } = require("worker_threads");

class GenAIWorker {
    constructor(samples) {
        this.worker = new Worker("./src/workerTask.js", {
            workerData: {
                action: "genai",
                args: [samples]
            },
            execArgv: ['--no-warnings']
        });

        this.nonce = 0;
        this.promises = new Map();

        this.worker.on("message", (msg) => {
            const promise = this.promises.get(msg.id);

            if (!promise) return;

            this.promises.delete(msg.id);

            if (msg.error) {
                promise.reject(msg.error);
            } else {
                promise.resolve(msg.result);
            }
        });

        this.worker.on("error", console.error);
    }

    request(action, ...args) {
        return new Promise((resolve, reject) => {
            const id = ++this.nonce;

            this.promises.set(id, {
                resolve,
                reject
            });

            this.worker.postMessage({
                id,
                action,
                args
            });
        });
    }

    generate(...args) {
        return this.request("generate", ...args);
    }

    train(...args) {
        return this.request("train", ...args);
    }

    undo(...args) {
        return this.request("undo", ...args);
    }

    destroy() {
        return this.worker.terminate();
    }
}

module.exports = GenAIWorker;