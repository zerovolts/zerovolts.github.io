import { RgbColor, HsvColor } from "/shared/color.js"

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
