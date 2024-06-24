document.addEventListener("DOMContentLoaded", async () => {
    window.app = new App();
});

const text = `in general when a rigid body moves both its position and orientation vary with time in the kinematic sense these changes are referred to as translation and rotation respectively indeed the position of a rigid body can be viewed as a hypothetic translation and rotation of the body starting from a hypothetic reference position not necessarily coinciding with a position actually taken by the body during its motion`.split(" ");

class App {
    constructor() {
        this.outputEl = document.getElementById("output");
        this.generateEl = document.getElementById("generate");

        this.generateEl.addEventListener("click", () => this.generate());

        this.mc = new MarkovChain();
        for (const word of text) {
            this.mc.train(word);
        }

        this.generate();
    }

    generate() {
        const words = Array(16);
        let i = 0;
        while (true) {
            if (i >= 16) break;
            const word = this.mc.generate().join("");
            if (word.length < 5 || word.length > 10) continue;
            i += 1;
            words[i] = word;
        }
        this.outputEl.innerText = words.join("\n");
    }
}

const letters = "abcdefghijklmnopqrstuvwxyz";
const startState = Object.create(null);
const endState = Object.create(null);

class MarkovChain {
    constructor() {
        this.counts = new Map();
    }

    generate() {
        let output = [];
        let state = startState;
        while (true) {
            state = this.nextState(state);
            if (state === endState) break;
            output.push(state);
        }
        return output;
    }

    nextState(prev) {
        const probabilities = this.probabilities.get(prev);
        const letters = this.values.get(prev);
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
        this.addPair(startState, arr[0]);
        for (let i = 0; i < arr.length - 1; i++) {
            this.addPair(arr[i], arr[i + 1]);
        }
        this.addPair(arr.at(-1), endState);
        this.recomputeAllProbabilities();
    }

    addPair(a, b) {
        if (this.counts.get(a) === undefined) {
            this.counts.set(a, new Map());
        }
        if (this.counts.get(a).get(b) === undefined) {
            this.counts.get(a).set(b, 0);
        }
        this.counts.get(a).set(b, this.counts.get(a).get(b) + 1);
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