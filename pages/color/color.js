import { clamp, randomRange } from "/shared/math.js";

const CHUNK_2 = /(.{1,2})/g;

class App {
    constructor() {
        this.encodeUrl = this.encodeUrl.bind(this);
        this.refreshColor = this.refreshColor.bind(this);
        this.refreshHsvColor = this.refreshHsvColor.bind(this);

        document.addEventListener("DOMContentLoaded", async () => {
            this.mainColorEl = document.getElementById("color-picker-display");

            this.byteColorEl = document.getElementById("byte-color");
            this.hexColorEl = document.getElementById("hex-color");
            this.fractColorEl = document.getElementById("fract-color");
            this.nonSrgbFractColorEl = document.getElementById("non-srgb-fract-color");

            this.redSliderEl = document.getElementById("red-slider");
            this.greenSliderEl = document.getElementById("green-slider");
            this.blueSliderEl = document.getElementById("blue-slider");

            this.redSliderEl.addEventListener("input", this.refreshColor);
            this.greenSliderEl.addEventListener("input", this.refreshColor);
            this.blueSliderEl.addEventListener("input", this.refreshColor);

            this.redSliderLabelEl = document.getElementById("red-slider-label");
            this.greenSliderLabelEl = document.getElementById("green-slider-label");
            this.blueSliderLabelEl = document.getElementById("blue-slider-label");

            this.hueSliderEl = document.getElementById("hue-slider");
            this.satSliderEl = document.getElementById("sat-slider");
            this.valSliderEl = document.getElementById("val-slider");

            this.hueSliderEl.addEventListener("input", this.refreshHsvColor);
            this.satSliderEl.addEventListener("input", this.refreshHsvColor);
            this.valSliderEl.addEventListener("input", this.refreshHsvColor);

            this.hueSliderLabelEl = document.getElementById("hue-slider-label");
            this.satSliderLabelEl = document.getElementById("sat-slider-label");
            this.valSliderLabelEl = document.getElementById("val-slider-label");

            this.decodeUrl();
        });
    }

    encodeUrl(color) {
        const url = new URL(window.location);
        url.searchParams.set("c", color.toHexString());
        window.history.replaceState(null, document.title, url.toString());
    }

    decodeUrl() {
        const url = new URL(window.location);
        const hex = url.searchParams.get("c") ?? "7f7f7f";
        this.setColor(RgbColor.fromHexString(hex));
    }

    getColor() {
        return new RgbColor(
            Number(this.redSliderEl.value),
            Number(this.greenSliderEl.value),
            Number(this.blueSliderEl.value),
        );
    }

    getHsvColor() {
        return new HsvColor(
            Number(this.hueSliderEl.value),
            Number(this.satSliderEl.value),
            Number(this.valSliderEl.value),
        );
    }

    setColor(color, persistHsv = true) {
        const { red, green, blue } = color;
        this.redSliderEl.value = red;
        this.greenSliderEl.value = green;
        this.blueSliderEl.value = blue;

        this.encodeUrl(color);

        const oldHsv = this.getHsvColor();
        const { hue, saturation, value } = color.toHsv();
        const newHsv = persistHsv
            ? new HsvColor(
                saturation > 0
                    ? oldHsv.hue < 1 ? hue : oldHsv.hue
                    : oldHsv.hue,
                value > 0 ? saturation : oldHsv.saturation,
                value,
            )
            : new HsvColor(hue, saturation, value);
        this.hueSliderEl.value = newHsv.hue;
        this.satSliderEl.value = newHsv.saturation;
        this.valSliderEl.value = newHsv.value;

        // RGB slider background adjustment
        this.redSliderEl.style = makeGradientString(
            new RgbColor(0, green, blue),
            new RgbColor(1, green, blue),
        );
        this.greenSliderEl.style = makeGradientString(
            new RgbColor(red, 0, blue),
            new RgbColor(red, 1, blue),
        );
        this.blueSliderEl.style = makeGradientString(
            new RgbColor(red, green, 0),
            new RgbColor(red, green, 1),
        );

        // HSV slider background adjustment
        this.hueSliderEl.style = makeGradientString(
            new HsvColor(0, saturation, value).toRgb(),
            new HsvColor(1 / 6, saturation, value).toRgb(),
            new HsvColor(2 / 6, saturation, value).toRgb(),
            new HsvColor(3 / 6, saturation, value).toRgb(),
            new HsvColor(4 / 6, saturation, value).toRgb(),
            new HsvColor(5 / 6, saturation, value).toRgb(),
            new HsvColor(1, saturation, value).toRgb(),
        );
        this.satSliderEl.style = makeGradientString(
            new HsvColor(hue, 0, value).toRgb(),
            new HsvColor(hue, 1, value).toRgb(),
        );
        this.valSliderEl.style = makeGradientString(
            new HsvColor(hue, saturation, 0).toRgb(),
            new HsvColor(hue, saturation, 1).toRgb(),
        );

        this.redSliderLabelEl.innerText = red.toFixed(3);
        this.greenSliderLabelEl.innerText = green.toFixed(3);
        this.blueSliderLabelEl.innerText = blue.toFixed(3);

        this.hueSliderLabelEl.innerText = newHsv.hue.toFixed(3);
        this.satSliderLabelEl.innerText = newHsv.saturation.toFixed(3);
        this.valSliderLabelEl.innerText = newHsv.value.toFixed(3);

        const byteString = color.toByteString();
        this.mainColorEl.style.backgroundColor = `rgb(${byteString})`;

        this.byteColorEl.innerText = byteString;
        this.hexColorEl.innerText = color.toHexString();
        this.fractColorEl.innerText = color.toFractString();
        this.nonSrgbFractColorEl.innerText = color.toNonSrgbFractString();
    }

    randomizeColor() {
        this.setColor(new RgbColor(
            Math.random(),
            Math.random(),
            Math.random(),
        ));
    }

    resetColor() {
        this.setColor(new RgbColor(0.5, 0.5, 0.5), false);
    }

    refreshColor() {
        this.setColor(this.getColor());
    }

    refreshHsvColor() {
        this.setColor(this.getHsvColor().toRgb());
    }

    copyByteValue() {
        navigator.clipboard.writeText(this.getColor().toByteString());
    }

    copyHexValue() {
        navigator.clipboard.writeText(this.getColor().toHexString());
    }

    copyFractValue() {
        navigator.clipboard.writeText(this.getColor().toFractString());
    }

    copyNonSrgbFractValue() {
        navigator.clipboard.writeText(this.getColor().toNonSrgbFractString());
    }
}

window.app = new App();

function makeGradientString(...rgbColors) {
    const colorStrings = rgbColors.map(c => `#${c.toHexString()}`);
    return `background: linear-gradient(90deg, ${colorStrings.join(", ")})`;
}

class RgbColor {
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

class HsvColor {
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
