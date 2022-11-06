import * as Vec2 from "/shared/vec2.js";

window.addEventListener("DOMContentLoaded", () => {
    const synth = new SubtractiveSynthesizer();
    createPianoRoll();

    const button = document.getElementById("power-toggle");
    button.addEventListener("click", () => {
        synth.enable();
    });

    // const keys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C"];
    // const keyboard = document.getElementById("keyboard");
    // for (let i = 0; i < 13; i++) {
    //     const key = document.createElement("button");
    //     key.addEventListener("mousedown", () => {
    //         synth.setNote(i - 9);
    //         synth.attack();
    //     });
    //     key.addEventListener("mouseup", () => {
    //         synth.release();
    //     });
    //     key.innerText = keys[i];
    //     keyboard.appendChild(key);
    // }
});

function createPianoRoll() {
    const container = document.getElementById("keyboard-container");
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "96px");
    svg.setAttribute("height", "32px");

    const keyTopWidths = [0.8, 1, 0.8, 1, 0.8, 0.8, 1, 0.8, 1, 0.8, 1, 0.8];
    const keyboardWidth = keyTopWidths.reduce((a, b) => a + b, 0);
    const whiteKeyWidth = keyboardWidth / 7;
    const blackKeyWidth = whiteKeyWidth * 0.5;
    const keyboardHeight = whiteKeyWidth * 4;

    const keys = [];
    for (let i = 0; i < 12; i++) {
        const keyTopWidth = keyTopWidths[i];
        if (isWhiteKey(i)) {
            keys.push({
                points: [],
                color: "#ffffff",
            });
        } else {
            keys.push({
                points: [[0, 0], [0, 0], [0, 0], [0, 0]].map(v => Vec2.add(v, [0, 0.5])),
                color: "#000000",
            });
        }
    }

    // const rect = [[0, 0], [0, 32], [8, 32], [8, 0]];
    // // start from top-left, counter-clockwise
    // const keys = [
    //     [rect, "white"],
    //     [rect.map(v => Vec2.add(v, [8, 0])), "black"],
    //     [rect.map(v => Vec2.add(v, [16, 0])), "white"],
    //     [rect.map(v => Vec2.add(v, [24, 0])), "black"],
    //     [rect.map(v => Vec2.add(v, [32, 0])), "white"],
    //     [rect.map(v => Vec2.add(v, [40, 0])), "white"],
    //     [rect.map(v => Vec2.add(v, [48, 0])), "black"],
    //     [rect.map(v => Vec2.add(v, [56, 0])), "white"],
    //     [rect.map(v => Vec2.add(v, [64, 0])), "black"],
    //     [rect.map(v => Vec2.add(v, [72, 0])), "white"],
    //     [rect.map(v => Vec2.add(v, [80, 0])), "black"],
    //     [rect.map(v => Vec2.add(v, [88, 0])), "white"],
    // ];

    for (const key of keys) {
        const poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        const pointsStr = key[0].map(point => point.join(",")).join(" ");
        poly.classList.add("keyboard-key");
        poly.setAttribute("points", pointsStr);
        poly.setAttribute("fill", key[1]);

        svg.appendChild(poly);
    }

    container.appendChild(svg);
}

// Computes the piano key color from the note number.
function isWhiteKey(note) {
    // white = 1, black = 0
    const keyColors = "101011010101";
    return keyColors[note % 12] === "1";
}

const oscType = [
    "sine",
    "triangle",
    "square",
    "sawtooth",
];

class SubtractiveSynthesizer {
    constructor() {
        this.ctx = new AudioContext();
        this.isEnabled = false;

        this.createOscillator();
        this.createFilter();
        this.createEnvelope();
        this.createAmp();

        this.osc.connect(this.filter);
        this.filter.connect(this.envelope);
        this.envelope.connect(this.amp);
        this.amp.connect(this.ctx.destination);
    }

    enable() {
        if (!this.isEnabled) {
            this.isEnabled = false;
            this.osc.start();
        }
    }

    setNote(note) {
        this.osc.frequency.value = noteToFrequency(note);
    }

    attack() {
        console.log("attack", this.envelope.gain.value);
        // this.envelope.gain.exponentialRampToValueAtTime(1, this.ctx.currentTime + 0.2);
        this.envelope.gain.setValueAtTime(1, this.ctx.currentTime);
    }

    release() {
        console.log("release", this.envelope.gain.value);
        this.envelope.gain.setValueAtTime(0, this.ctx.currentTime);
    }

    createOscillator() {
        const osc = this.ctx.createOscillator();

        /** @type HTMLInputElement */
        const shapeButton = document.getElementById("osc-shape");
        osc.type = shapeButton.value
        shapeButton.addEventListener("click", () => {
            let newShape;
            switch (shapeButton.value) {
                case "sine":
                    newShape = "triangle";
                    break;
                case "triangle":
                    newShape = "square";
                    break;
                case "square":
                    newShape = "sawtooth";
                    break;
                case "sawtooth":
                    newShape = "sine";
                    break;
                default:
                    newShape = "sine";
                    break;
            }
            shapeButton.value = newShape;
            shapeButton.innerText = newShape;
            osc.type = newShape;
        });

        /** @type HTMLInputElement */
        const freqDial = document.getElementById("freq");
        osc.frequency.value = freqDial.value
        freqDial.addEventListener("rotate", () => {
            osc.frequency.value = freqDial.value;
        });

        this.osc = osc;
    }

    createFilter() {
        const filter = this.ctx.createBiquadFilter();
        filter.type = "lowpass"

        /** @type HTMLInputElement */
        const typeButton = document.getElementById("filter-type");
        filter.type = typeButton.value
        typeButton.addEventListener("click", () => {
            let newType;
            switch (typeButton.value) {
                case "lowpass":
                    newType= "highpass";
                    break;
                case "highpass":
                    newType= "bandpass";
                    break;
                case "bandpass":
                    newType= "lowpass";
                    break;
                default:
                    newType= "lowpass";
                    break;
            }
            typeButton.value = newType;
            typeButton.innerText = newType;
            filter.type = newType;
        });

        /** @type HTMLInputElement */
        const filterCutoffDial= document.getElementById("filter-cutoff");
        filter.frequency.value = filterCutoffDial.value;
        filterCutoffDial.addEventListener("rotate", () => {
            filter.frequency.value = filterCutoffDial.value;
        });

        /** @type HTMLInputElement */
        const filterQDial= document.getElementById("filter-q");
        filter.Q.value = filterQDial.value;
        filterQDial.addEventListener("rotate", () => {
            console.log(filterQDial.value);
            filter.Q.value = filterQDial.value;
        });

        this.filter = filter;
    }

    createEnvelope() {
        const envelope = this.ctx.createGain();
        envelope.gain.setValueAtTime(0.01, this.ctx.currentTime);
        this.envelope = envelope;
    }

    createAmp() {
        const amp = this.ctx.createGain();

        /** @type HTMLInputElement */
        const ampDial = document.getElementById("amp");
        amp.gain.value = ampDial.value;
        ampDial.addEventListener("rotate", () => {
            amp.gain.value = ampDial.value;
        });

        this.amp = amp;
    }
}

// `note` is the number of semitones away from middle A. Can be negative.
function noteToFrequency(note) {
    return 440 * Math.pow(2, note / 12);
}

/**
 * @param callback - (value) => void
 */
function createDial(parent, label, min, max, callback) {
    const dialContainer = document.createElement("div");
    dialContainer.className = "dial-input";

    const labelEl = document.createElement("label");
    labelEl.innerText = labelEl;

    const dial = document.createElement("zv-dial");
    dial.setAttribute("data-min", min.toString());
    dial.setAttribute("data-max", max.toString());

    dial.addEventListener("rotate", () => callback(dial.value));

    dialContainer.appendChild(label);
    dialContainer.appendChild(dial);
    parent.appendChild(dialContainer);
}