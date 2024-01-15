import { clamp } from "/shared/math.js";

const CHUNK_2 = /(.{1,2})/g;

export function rgb(r, g, b) { return new RgbColor([r, g, b]); };

export class RgbColor {
    constructor(data) {
        this.data = data;
    }

    static fromBytes(red, green, blue) {
        return rgb(
            red / 255,
            green / 255,
            blue / 255,
        );
    }

    static fromHexString(hex) {
        const bytes = hex.match(CHUNK_2).map(byte => parseInt(byte, 16));
        return RgbColor.fromBytes(bytes[0], bytes[1], bytes[2]);
    }

    get r() {
        return this.data[0];
    }

    get g() {
        return this.data[1];
    }

    get b() {
        return this.data[2];
    }

    set r(value) {
        this.data[0] = value;
    }

    set g(value) {
        this.data[1] = value;
    }

    set b(value) {
        this.data[2] = value;
    }

    normalized() {
        return this.data.map(c => clamp(c, 0, 1));
    }

    toBytes() {
        return this.data.map(c => Math.floor(c * 255));
    }

    toHexString() {
        return this.toBytes().map(byteToHex).join("");
    }

    toByteString() {
        return this.toBytes().join(", ");
    }

    toFractString() {
        return this.data.map(c => c.toFixed(2)).join(", ");
    }

    toNonSrgbFractString() {
        return this.data.map(c => Math.pow(c, 2.2).toFixed(2)).join(", ");
    }

    toHsv() {
        const cMax = Math.max(...this.data);
        const cMin = Math.min(...this.data);
        const delta = cMax - cMin;

        let hue;
        if (cMax === cMin) hue = 0;
        else if (cMax === this.r) hue = (this.g - this.b) / delta;
        else if (cMax === this.g) hue = (this.b - this.r) / delta + 2;
        else if (cMax === this.b) hue = (this.r - this.g) / delta + 4;
        hue /= 6;

        return hsv(
            modWrap(hue),
            cMax === 0 ? 0 : delta / cMax,
            cMax,
        );
    }
}

export function hsv(h, s, v) { return new HsvColor([h, s, v]); }

export class HsvColor {
    constructor(data) {
        this.data = data;
    }

    get h() {
        return this.data[0];
    }

    get s() {
        return this.data[1];
    }

    get v() {
        return this.data[2];
    }

    set h(value) {
        this.data[0] = value;
    }

    set s(value) {
        this.data[1] = value;
    }

    set v(value) {
        this.data[2] = value;
    }

    toRgb() {
        let h = modWrap(this.h) * 6;

        // Chroma
        const c = this.v * this.s;
        // A triangle wave with 3 peaks aligned with the rgb component peaks on
        // the hue spectrum.
        const x = c * (1 - Math.abs(h % 2 - 1));
        const m = this.v - c;

        const sector = Math.floor(h);
        switch (sector) {
            case 0: return rgb(c + m, x + m, m);
            case 1: return rgb(x + m, c + m, m);
            case 2: return rgb(m, c + m, x + m);
            case 3: return rgb(m, x + m, c + m);
            case 4: return rgb(x + m, m, c + m);
            case 5: return rgb(c + m, m, x + m);
        }
    }
}

function modWrap(x) {
    if (x < 0) return x + 1;
    if (x >= 1) return x - 1;
    return x
}

function byteToHex(byte) {
    return byte.toString(16).padStart(2, "0");
}