import { clamp } from "/shared/math.js";

const CHUNK_2 = /(.{1,2})/g;

export class RgbColor {
    constructor(red, green, blue) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.normalize();
    }

    static fromBytes(red, green, blue) {
        return new RgbColor(
            red / 255,
            green / 255,
            blue / 255,
        );
    }

    static fromHexString(hex) {
        const bytes = hex.match(CHUNK_2).map(byte => parseInt(byte, 16));
        return RgbColor.fromBytes(bytes[0], bytes[1], bytes[2]);
    }

    static fromHsv(hue, sat, val) {
        hue = modWrap(hue);
        hue *= 6;

        // Chroma
        const c = val * sat;
        // A triangle wave with 3 peaks aligned with the rgb component peaks on
        // the hue spectrum.
        const x = c * (1 - Math.abs(hue % 2 - 1));
        const m = val - c;

        const sector = Math.floor(hue);
        switch (sector) {
            case 0: return new RgbColor(c + m, x + m, m);
            case 1: return new RgbColor(x + m, c + m, m);
            case 2: return new RgbColor(m, c + m, x + m);
            case 3: return new RgbColor(m, x + m, c + m);
            case 4: return new RgbColor(x + m, m, c + m);
            case 5: return new RgbColor(c + m, m, x + m);
        }
    }

    normalize() {
        this.red = clamp(this.red, 0, 1);
        this.green = clamp(this.green, 0, 1);
        this.blue = clamp(this.blue, 0, 1);
    }

    toBytes() {
        return [this.red, this.green, this.blue].map(c => Math.floor(c * 255));
    }

    toHexString() {
        return this.toBytes().map(byteToHex).join("");
    }

    toByteString() {
        return this.toBytes().join(", ");
    }

    toFractString() {
        return [this.red, this.green, this.blue].map(c => c.toFixed(2)).join(", ");
    }

    toNonSrgbFractString() {
        return [this.red, this.green, this.blue].map(c => Math.pow(c, 2.2).toFixed(2)).join(", ");
    }

    toHsv() {
        return HsvColor.fromRgb(this.red, this.green, this.blue);
    }
}

export class HsvColor {
    constructor(hue, saturation, value) {
        this.hue = hue;
        this.saturation = saturation;
        this.value = value;
    }

    static fromRgb(red, green, blue) {
        const cMax = Math.max(red, green, blue);
        const cMin = Math.min(red, green, blue);
        const delta = cMax - cMin;

        let hue;
        if (cMax === cMin) hue = 0;
        else if (cMax === red) hue = (green - blue) / delta;
        else if (cMax === green) hue = (blue - red) / delta + 2;
        else if (cMax === blue) hue = (red - green) / delta + 4;
        hue /= 6;

        return new HsvColor(
            modWrap(hue),
            cMax === 0 ? 0 : delta / cMax,
            cMax,
        );
    }

    toRgb() {
        return RgbColor.fromHsv(this.hue, this.saturation, this.value);
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