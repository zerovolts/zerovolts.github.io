import { randomRange } from "/shared/math.js";

class App {
    constructor() {
        document.addEventListener("DOMContentLoaded", async () => {
            this.refreshColor = this.refreshColor.bind(this);
            this.copyRgbValue = this.copyRgbValue.bind(this);
            this.copyHexValue = this.copyHexValue.bind(this);
            
            this.mainColorEl = document.getElementById("color-picker-display");
            this.rgbColorEl = document.getElementById("rgb-color");
            this.rgbColorEl.addEventListener("click", this.copyRgbValue);
            this.hexColorEl = document.getElementById("hex-color");
            this.hexColorEl.addEventListener("click", this.copyHexValue);

            this.redSliderEl = document.getElementById("red-slider");
            this.redSliderEl.addEventListener("input", this.refreshColor);
            this.greenSliderEl = document.getElementById("green-slider");
            this.greenSliderEl.addEventListener("input", this.refreshColor);
            this.blueSliderEl = document.getElementById("blue-slider");
            this.blueSliderEl.addEventListener("input", this.refreshColor);

            this.buttonRandom = document.getElementById("button-random");
            this.buttonRandom.addEventListener("click", () => {
                this.setColor(new Color(
                    randomRange(0, 255),
                    randomRange(0, 255),
                    randomRange(0, 255),
                ));
            });
            this.buttonNudge = document.getElementById("button-nudge");
            this.buttonNudge.addEventListener("click", () => {
                const nudgeScale = 5
                const color = this.getColor();
                this.setColor(new Color(
                    color.red + randomRange(-nudgeScale, nudgeScale),
                    color.green+ randomRange(-nudgeScale, nudgeScale),
                    color.blue + randomRange(-nudgeScale, nudgeScale),
                ));
            });
            this.buttonDarker = document.getElementById("button-darker");
            this.buttonDarker.addEventListener("click", () => {
                this.setColor(this.getColor().addValue(-10));
            });
            this.buttonLighter = document.getElementById("button-lighter");
            this.buttonLighter.addEventListener("click", () => {
                this.setColor(this.getColor().addValue(10));
            });

            this.refreshColor();
        });
    }

    getColor() {
        return new Color(
            Number(this.redSliderEl.value),
            Number(this.greenSliderEl.value),
            Number(this.blueSliderEl.value),
        );
    }

    setColor(color) {
        this.redSliderEl.value = color.red;
        this.greenSliderEl.value = color.green;
        this.blueSliderEl.value = color.blue;

        this.hexColorEl.innerText = color.toHexString();
        const rgb = color.toRgbString();
        this.rgbColorEl.innerText = rgb;
        this.mainColorEl.style.backgroundColor = rgb;
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

class Color {
    constructor(red, green, blue) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.normalize();
    }

    normalize() {
        this.red = clamp(Math.floor(this.red), 0, 255);
        this.green = clamp(Math.floor(this.green), 0, 255);
        this.blue = clamp(Math.floor(this.blue), 0, 255);
    }

    toHexString() {
        return `#${
            this.red.toString(16).padStart(2, "0")
        }${
            this.green.toString(16).padStart(2, "0")
        }${
            this.blue.toString(16).padStart(2, "0")
        }`;
    }

    toRgbString() {
        return `rgb(${Number(this.red)}, ${Number(this.green)}, ${Number(this.blue)})`;
    }

    addValue(amount) {
        return new Color(
            this.red += amount,
            this.green += amount,
            this.blue += amount,
        );
    }
}

function clamp(value, min, max) {
    if (value < min) {
        return min;
    }
    if (value > max) {
        return max;
    }
    return value;
}