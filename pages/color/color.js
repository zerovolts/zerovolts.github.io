import { clamp, randomRange } from "/shared/math.js";

class App {
    constructor() {
        this.refreshColor = this.refreshColor.bind(this);
        this.copyRgbValue = this.copyRgbValue.bind(this);
        this.copyHexValue = this.copyHexValue.bind(this);
        this.randomizeColor = this.randomizeColor.bind(this);
        this.nudgeColor = this.nudgeColor.bind(this);
        this.darkenColor = this.darkenColor.bind(this);
        this.lightenColor = this.lightenColor.bind(this);

        document.addEventListener("DOMContentLoaded", async () => {
            this.mainColorEl = document.getElementById("color-picker-display");

            this.rgbColorEl = document.getElementById("rgb-color");
            this.hexColorEl = document.getElementById("hex-color");

            this.rgbColorEl.addEventListener("click", this.copyRgbValue);
            this.hexColorEl.addEventListener("click", this.copyHexValue);

            this.redSliderEl = document.getElementById("red-slider");
            this.greenSliderEl = document.getElementById("green-slider");
            this.blueSliderEl = document.getElementById("blue-slider");

            this.redSliderEl.addEventListener("input", this.refreshColor);
            this.greenSliderEl.addEventListener("input", this.refreshColor);
            this.blueSliderEl.addEventListener("input", this.refreshColor);

            this.buttonRandom = document.getElementById("button-random");
            this.buttonNudge = document.getElementById("button-nudge");
            this.buttonDarker = document.getElementById("button-darker");
            this.buttonLighter = document.getElementById("button-lighter");

            this.buttonRandom.addEventListener("click", this.randomizeColor);
            this.buttonNudge.addEventListener("click", this.nudgeColor);
            this.buttonDarker.addEventListener("click", this.darkenColor);
            this.buttonLighter.addEventListener("click", this.lightenColor);

            this.refreshColor();
        });
    }

    getColor() {
        return RgbColor.fromBytes(
            Number(this.redSliderEl.value),
            Number(this.greenSliderEl.value),
            Number(this.blueSliderEl.value),
        );
    }

    setColor(color) {
        const [red, green, blue] = color.toBytes();
        this.redSliderEl.value = red;
        this.greenSliderEl.value = green;
        this.blueSliderEl.value = blue;

        this.hexColorEl.innerText = color.toHexString();
        const rgb = color.toRgbString();
        this.rgbColorEl.innerText = rgb;
        this.mainColorEl.style.backgroundColor = rgb;
    }

    randomizeColor() {
        this.setColor(RgbColor.fromBytes(
            randomRange(0, 256),
            randomRange(0, 256),
            randomRange(0, 256),
        ));
    }

    nudgeColor() {
        const nudgeScale = 5
        const color = this.getColor();
        const [red, green, blue] = color.toBytes();

        this.setColor(RgbColor.fromBytes(
            red + randomRange(-nudgeScale, nudgeScale + 1),
            green + randomRange(-nudgeScale, nudgeScale + 1),
            blue + randomRange(-nudgeScale, nudgeScale + 1),
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

    copyRgbValue() {
        navigator.clipboard.writeText(this.getColor().toRgbString());
    }

    copyHexValue() {
        navigator.clipboard.writeText(this.getColor().toHexString());
    }
}
new App();

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
        return `#${byteToHex(red)}${byteToHex(green)}${byteToHex(blue)}`;
    }

    toRgbString() {
        const [red, green, blue] = this.toBytes();
        return `rgb(${red}, ${green}, ${blue})`;
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
