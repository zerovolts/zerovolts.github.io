import { mountEl, span, text } from "/shared/dom.js";

// Initiate the fetch first to reduce perceived loading.
let trainingData = Promise.all([
    fetch("./adjectives.txt").then(res => res.text()),
    fetch("./verbs.txt").then(res => res.text()),
    fetch("./nouns.txt").then(res => res.text()),
]);

document.addEventListener("DOMContentLoaded", async () => {
    trainingData = (await trainingData).map(listStr => [...new Set(listStr.split(" "))]);
    window.app = new App();
});

class App {
    constructor() {
        this.outputEl = document.getElementById("output");
        this.titleEl = document.getElementById("title");

        this.genAdjEl = document.getElementById("gen-adj");
        this.genVerbEl = document.getElementById("gen-verb");
        this.genNounEl = document.getElementById("gen-noun");

        this.genAdjEl.addEventListener("click", () => {
            this.generate(this.adjectiveGenerator)
            this.titleEl.innerText = "Adjectives";
        });
        this.genVerbEl.addEventListener("click", () => {
            this.generate(this.verbGenerator)
            this.titleEl.innerText = "Verbs";
        });
        this.genNounEl.addEventListener("click", () => {
            this.generate(this.nounGenerator)
            this.titleEl.innerText = "Nouns";
        });

        this.adjectiveGenerator = new MarkovChain();
        for (const word of trainingData[0]) {
            this.adjectiveGenerator.train(word);
        }
        this.verbGenerator = new MarkovChain();
        for (const word of trainingData[1]) {
            this.verbGenerator.train(word);
        }
        this.nounGenerator = new MarkovChain();
        for (const word of trainingData[2]) {
            this.nounGenerator.train(word);
        }

        this.generate(this.adjectiveGenerator);
    }

    generate(generator) {
        const words = Array(16);
        let i = 0;
        while (true) {
            if (i >= 32) break;
            const word = generator.generate().join("");
            if (word.length < 5 || word.length > 10) continue;
            words[i] = word;
            i += 1;
        }
        mountEl(this.outputEl, words.map(word => span({}, [text(word)])));
    }
}

const startState = Object.create(null);
const endState = Object.create(null);

class MarkovChain {
    constructor() {
        this.counts = new Map();
        this.windowSize = 2;
    }

    generate() {
        let output = [];
        let state = Array(this.windowSize).fill(startState);
        while (true) {
            const newState = this.nextState(state);
            if (newState === endState) break;
            state[0] = state[1];
            state[1] = newState;
            output.push(newState);
        }
        return output;
    }

    nextState(prev) {
        const key = stateToKey(prev);
        const probabilities = this.probabilities.get(key);
        const letters = this.values.get(key);
        const r = Math.random();

        // TODO: binary search
        for (let i = 0; i < probabilities.length; i++) {
            const probability = probabilities[i];
            if (r < probability) {
                return letters[i];
            }
        }
    }

    train(arr) {
        this.addPair([startState, startState], arr[0]);
        this.addPair([startState, arr[0]], arr[1]);
        for (let i = 0; i < arr.length - 2; i++) {
            this.addPair([arr[i], arr[i + 1]], arr[i + 2]);
        }
        this.addPair([arr.at(-2), arr.at(-1)], endState);
        this.recomputeAllProbabilities();
    }

    addPair(a, b) {
        const key = stateToKey(a);
        if (this.counts.get(key) === undefined) {
            this.counts.set(key, new Map());
        }
        if (this.counts.get(key).get(b) === undefined) {
            this.counts.get(key).set(b, 0);
        }
        this.counts.get(key).set(b, this.counts.get(key).get(b) + 1);
    }

    recomputeAllProbabilities() {
        this.probabilities = new Map();
        this.values = new Map();
        for (const key of this.counts.keys()) {
            this.recomputeProbabilities(key);
        }
    }

    recomputeProbabilities(a) {
        const keys = [...this.counts.get(a).keys()];
        const total = [...this.counts.get(a).values()].reduce((acc, cur) => acc + cur, 0);

        this.probabilities.set(a, Array(keys.length));
        this.values.set(a, Array(keys.length));

        let maxChance = 0;
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            maxChance += this.counts.get(a).get(key) / total;
            this.probabilities.get(a)[i] = maxChance;
            this.values.get(a)[i] = key;
        }
    }
}

function stateToKey(state) {
    return state.map(value => {
        if (value === startState) return "<start>";
        if (value === endState) return "<end>";
        return value;
    }).join(":");
}