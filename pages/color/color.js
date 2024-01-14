import { clamp, randomRange } from "/shared/math.js";

class App {
    constructor() {
        this.refreshColor = this.refreshColor.bind(this);

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

    setColor(color) {
        const { red, green, blue } = color;
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
}

function byteToHex(byte) {
    return byte.toString(16).padStart(2, "0");
}
