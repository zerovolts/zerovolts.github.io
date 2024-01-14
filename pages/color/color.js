import { clamp, randomRange } from "/shared/math.js";

class App {
    constructor() {
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

            this.refreshColor();
        });
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

    setColor(color) {
        const { red, green, blue } = color;
        this.redSliderEl.value = red;
        this.greenSliderEl.value = green;
        this.blueSliderEl.value = blue;

        const { hue, saturation, value } = color.toHsv();
        this.hueSliderEl.value = hue;
        this.satSliderEl.value = saturation;
        this.valSliderEl.value = value;

        this.redSliderEl.style = `background: linear-gradient(90deg, #${
            new RgbColor(0, green, blue).toHexString()
        }, #${
            new RgbColor(1, green, blue).toHexString()
        })`;
        this.greenSliderEl.style = `background: linear-gradient(90deg, #${
            new RgbColor(red, 0, blue).toHexString()
        }, #${
            new RgbColor(red, 1, blue).toHexString()
        })`;
        this.blueSliderEl.style = `background: linear-gradient(90deg, #${
            new RgbColor(red, green, 0).toHexString()
        }, #${
            new RgbColor(red, green, 1).toHexString()
        })`;

        this.redSliderLabelEl.innerText = red.toFixed(3);
        this.greenSliderLabelEl.innerText = green.toFixed(3);
        this.blueSliderLabelEl.innerText = blue.toFixed(3);

        this.hueSliderLabelEl.innerText = hue.toFixed(3);
        this.satSliderLabelEl.innerText = saturation.toFixed(3);
        this.valSliderLabelEl.innerText = value.toFixed(3);

        this.hueSliderEl.style = `background: linear-gradient(90deg, #${
            new HsvColor(0, saturation, value).toRgb().toHexString()
        }, #${
            new HsvColor(1 / 6, saturation, value).toRgb().toHexString()
        }, #${
            new HsvColor(2 / 6, saturation, value).toRgb().toHexString()
        }, #${
            new HsvColor(3 / 6, saturation, value).toRgb().toHexString()
        }, #${
            new HsvColor(4 / 6, saturation, value).toRgb().toHexString()
        }, #${
            new HsvColor(5 / 6, saturation, value).toRgb().toHexString()
        }, #${
            new HsvColor(1, saturation, value).toRgb().toHexString()
        })`;
        this.satSliderEl.style = `background: linear-gradient(90deg, #${
            new HsvColor(hue, 0, value).toRgb().toHexString()
        }, #${
            new HsvColor(hue, 1, value).toRgb().toHexString()
        })`;
        this.valSliderEl.style = `background: linear-gradient(90deg, #${
            new HsvColor(hue, saturation, 0).toRgb().toHexString()
        }, #${
            new HsvColor(hue, saturation, 1).toRgb().toHexString()
        })`;

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

    nudgeColor() {
        const nudgeScale = .02;
        const color = this.getColor();

        this.setColor(new RgbColor(
            color.red + randomRange(-nudgeScale, nudgeScale),
            color.green + randomRange(-nudgeScale, nudgeScale),
            color.blue + randomRange(-nudgeScale, nudgeScale),
        ));
    }

    darkenColor() {
        this.setColor(this.getColor().addValue(-0.05));
    }

    lightenColor() {
        this.setColor(this.getColor().addValue(0.05));
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

class RgbColor {
    constructor(red, green, blue) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.normalize();
    }

    normalize() {
        this.red = clamp(this.red, 0, 1);
        this.green = clamp(this.green, 0, 1);
        this.blue = clamp(this.blue, 0, 1);
    }

    static fromBytes(red, green, blue) {
        return new RgbColor(
            red / 255,
            green / 255,
            blue / 255,
        );
    }

    toBytes() {
        return [
            Math.floor(this.red * 255),
            Math.floor(this.green * 255),
            Math.floor(this.blue * 255),
        ];
    }

    toHexString() {
        const [red, green, blue] = this.toBytes();
        return `${byteToHex(red)}${byteToHex(green)}${byteToHex(blue)}`;
    }

    toByteString() {
        const [red, green, blue] = this.toBytes();
        return `${red}, ${green}, ${blue}`;
    }

    toFractString() {
        return `${this.red.toFixed(2)}, ${this.green.toFixed(2)}, ${this.blue.toFixed(2)}`;
    }

    toNonSrgbFractString() {
        return `${Math.pow(this.red, 2.2).toFixed(2)}, ${Math.pow(this.green, 2.2).toFixed(2)}, ${Math.pow(this.blue, 2.2).toFixed(2)}`;
    }

    addValue(amount) {
        return new RgbColor(
            this.red += amount,
            this.green += amount,
            this.blue += amount,
        );
    }

    toHsv() {
        return HsvColor.fromRgb(this.red, this.green, this.blue);
    }

    static fromHsv(hue, sat, val) {
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
}

class HsvColor {
    constructor(hue, saturation, value) {
        this.hue = modWrap(hue);
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
