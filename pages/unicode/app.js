import { div, mountEl, span, text } from "/shared/dom.js";
import { clamp, lerp } from "/shared/math.js";

document.addEventListener("DOMContentLoaded", async () => {
    const canvas = document.getElementById("main-canvas");
    window.app = new App(canvas);
});

// "λ" - utf8 character
// 955 - utf8 codepoint
// "1110111011" - len=10 - codepoint in binary
// ["1110", "111011"] - 
// [14, 59] | [192, 128]
// [206, 187]
// ["11001110", "10111011"]

class App {
    constructor() {
        this.updateInputFromSlider = this.updateInputFromSlider.bind(this);
        this.updateInput = this.updateInput.bind(this);

        this.bitContainerEl = document.getElementById("bit-container");
        this.characterEl = document.getElementById("character");
        this.codePointSliderEl = document.getElementById("code-point-slider");
        this.intBinaryContainerEl = document.getElementById("int-binary-container");
        this.utf8BinaryContainerEl = document.getElementById("utf8-binary-container");

        this.codePointSliderEl.addEventListener("input", this.updateInputFromSlider);

        this.updateInputFromSlider();
    }

    updateInputFromSlider() {
        const utf8Ranges = [0, 0x80, 0x800, 0x10000, 0x10ffff];
        const value = Number(this.codePointSliderEl.value);
        const progress = value % 1;
        const sector = Math.floor(value);
        const scaledValue = Math.floor(lerp(
            utf8Ranges[sector],
            utf8Ranges[clamp(sector + 1, 0, 4)],
            progress
        ));
        this.updateInput(scaledValue);
    }

    updateInput(codePoint) {
        this.characterEl.innerText = String.fromCodePoint(codePoint);
        mountEl(this.bitContainerEl, renderBitPattern(codePoint));
        mountEl(this.intBinaryContainerEl, renderRawBits(codePoint));
        mountEl(this.utf8BinaryContainerEl, renderUtf8Bits(codePoint));
    }
}

function renderRawBits(codePoint) {
    const binary = codePoint.toString(2);
    const byteCount = stringToUtf8ByteCount(binary);
    const sections = splitStringByUtf8Bytes(codePoint.toString(2));
    const byteLengths = UNICODE_BYTE_LENGTHS[byteCount - 1];

    const padding = Math.ceil(binary.length / 8) * 8 - UNICODE_MAX_BIT_LENGTH[byteCount - 1];
    console.log(Math.ceil(binary.length / 8) * 8);
    console.log(UNICODE_MAX_BIT_LENGTH[byteCount - 1]);

    let bits = padding;
    console.log("padding", padding)
    return sections.map((section, i) => {
        bits += section.length;
        let output;
        if (bits >= 8) {
            bits -= 8;
            // output = `${section}`
            const slicePoint = byteLengths[i] - bits;
            output = [section.slice(0, slicePoint), section.slice(slicePoint, section.length)].join(" ")
            console.log("add space");
        } else {
            output = section;
            console.log("no space");
        }
        console.log("bits", bits, section.length);
        return span({ class: `byte${byteCount - i}` }, [text(output)]);
    });
}

function renderUtf8Bits(codePoint) {
    const binary = codePoint.toString(2);
    const byteCount = stringToUtf8ByteCount(binary);
    const staticBits = UTF8_STATIC_BITS[byteCount - 1];
    const bytes = codePointToUtf8Bytes(codePoint)
        .map(byte => byte.toString(2).padStart(8, "0"));

    return bytes.map((byte, i) => ([
        // TODO: this shouldn't appear on the first iteration.
        text(" "),
        span({ class: "static-bits" }, [text(byte.slice(0, staticBits[i]))]),
        span({ class: `byte${byteCount - i}` }, [text(byte.slice(staticBits[i], 8))]),
    ])).flat();
}

function intersperse() { }

function renderBitPattern(codePoint) {
    const binary = codePoint.toString(2);
    const byteCount = stringToUtf8ByteCount(binary);
    const bytes = codePointToUtf8Bytes(codePoint)
        .map(byte => byte.toString(2).padStart(8, "0"));
    const leadingOnes = UNICODE_LEADING_ONES[byteCount - 1];

    return bytes.map((byte, i) => (
        div({ class: "row-4" }, mapRange(0, 8, (j) => {
            const bit = byte[j] === "1";
            const el = div({ class: "bit" }, []);
            el.classList.add(
                bit
                    ? leadingOnes[i] < j ? "bit-one" : "bit-one-static"
                    : leadingOnes[i] !== j ? "bit-zero" : "bit-zero-static"
            );
            return el;
        }))
    ));
}

function mapRange(min, max, fn) {
    return Array(max - min)
        .fill(null)
        .map((_, i) => fn(i + min));
}

const UNICODE_MIN_VALUE = [0, 0x80, 0x800, 0x10000];

// Theoretical 4-byte max should be 0x1fffff, but utf-8 is restricted by utf-16.
const UNICODE_MAX_VALUE = [0x7f, 0x7ff, 0xffff, 0x10ffff];

const UNICODE_MAX_BIT_LENGTH = [7, 11, 16, 21];

const UNICODE_BYTE_LENGTHS = [
    [7],
    [5, 6],
    [4, 6, 6],
    [3, 6, 6, 6],
];

const UNICODE_BIT_MASKS_OR = [
    [0b00000000],
    [0b11000000, 0b10000000],
    [0b11100000, 0b10000000, 0b10000000],
    [0b11110000, 0b10000000, 0b10000000, 0b10000000],
];

const UNICODE_BIT_MASKS_AND = [
    [0b01111111],
    [0b11011111, 0b10111111],
    [0b11101111, 0b10111111, 0b10111111],
    [0b11110111, 0b10111111, 0b10111111, 0b10111111],
];

const UNICODE_LEADING_ONES = [
    [0],
    [2, 1],
    [3, 1, 1],
    [4, 1, 1, 1],
]

const UTF8_STATIC_BITS = [
    [1],
    [3, 2],
    [4, 2, 2],
    [5, 2, 2, 2],
]

function codePointToUtf8Bytes(x) {
    const binaryStr = x.toString(2);
    const byteCount = stringToUtf8ByteCount(binaryStr);
    const bytes = splitStringByUtf8Bytes(binaryStr);
    const or_masks = UNICODE_BIT_MASKS_OR[byteCount - 1];
    const and_masks = UNICODE_BIT_MASKS_AND[byteCount - 1];
    return bytes.map((byte, i) => Number.parseInt(byte, 2) | or_masks[i] & and_masks[i]);
}

function splitStringByUtf8Bytes(s) {
    const byteCount = stringToUtf8ByteCount(s);
    const byteLengths = UNICODE_BYTE_LENGTHS[byteCount - 1];
    const padding = UNICODE_MAX_BIT_LENGTH[byteCount - 1] - s.length;

    let start = 0;
    let end = byteLengths[0] - padding;
    const bytes = [];
    for (let i = 0; i < byteCount; i++) {
        // Handles the case where the number of bits is too large to fit in the
        // smaller byte count, but not larger enough to require use of the most
        // significant byte in the large byte count.
        const byte = start <= end
            ? s.slice(start, end).padStart(byteLengths[i], "0")
            : 0;
        bytes.push(byte);

        start = end;
        end += byteLengths[i];
    }
    return bytes;
}

// unicode will have different thresholds, because space must be made for the "container".
function stringToUtf8ByteCount(binary) {
    const len = binary.length;
    if (len <= 7) { return 1; }
    if (len <= 11) { return 2; }
    if (len <= 16) { return 3; }
    // len <= 22
    return 4;
}