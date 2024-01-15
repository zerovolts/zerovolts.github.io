import { RgbColor, HsvColor, rgb, hsv } from "/shared/color.js"

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
        return rgb(
            Number(this.redSliderEl.value),
            Number(this.greenSliderEl.value),
            Number(this.blueSliderEl.value),
        );
    }

    getHsvColor() {
        return hsv(
            Number(this.hueSliderEl.value),
            Number(this.satSliderEl.value),
            Number(this.valSliderEl.value),
        );
    }

    setColor(color, persistHsv = true) {
        const { r, g, b } = color;
        this.redSliderEl.value = r;
        this.greenSliderEl.value = g;
        this.blueSliderEl.value = b;

        this.encodeUrl(color);

        const oldHsv = this.getHsvColor();
        const newHsv = color.toHsv();
        // Persist the previous hue and saturation values when the color becomes
        // pure gray, white, or black.
        const { h, s, v } = persistHsv
            ? hsv(
                newHsv.s > 0
                    ? oldHsv.h < 1 ? newHsv.h : oldHsv.h
                    : oldHsv.h,
                newHsv.v > 0 ? newHsv.s : oldHsv.s,
                newHsv.v,
            )
            : newHsv;
        this.hueSliderEl.value = h;
        this.satSliderEl.value = s;
        this.valSliderEl.value = v;

        // RGB slider background adjustment
        this.redSliderEl.style = makeGradientString(
            rgb(0, g, b),
            rgb(1, g, b),
        );
        this.greenSliderEl.style = makeGradientString(
            rgb(r, 0, b),
            rgb(r, 1, b),
        );
        this.blueSliderEl.style = makeGradientString(
            rgb(r, g, 0),
            rgb(r, g, 1),
        );

        // HSV slider background adjustment
        this.hueSliderEl.style = makeGradientString(
            hsv(0, s, v).toRgb(),
            hsv(1 / 6, s, v).toRgb(),
            hsv(2 / 6, s, v).toRgb(),
            hsv(3 / 6, s, v).toRgb(),
            hsv(4 / 6, s, v).toRgb(),
            hsv(5 / 6, s, v).toRgb(),
            hsv(1, s, v).toRgb(),
        );
        this.satSliderEl.style = makeGradientString(
            hsv(h, 0, v).toRgb(),
            hsv(h, 1, v).toRgb(),
        );
        this.valSliderEl.style = makeGradientString(
            hsv(h, s, 0).toRgb(),
            hsv(h, s, 1).toRgb(),
        );

        this.redSliderLabelEl.innerText = r.toFixed(3);
        this.greenSliderLabelEl.innerText = g.toFixed(3);
        this.blueSliderLabelEl.innerText = b.toFixed(3);

        this.hueSliderLabelEl.innerText = h.toFixed(3);
        this.satSliderLabelEl.innerText = s.toFixed(3);
        this.valSliderLabelEl.innerText = v.toFixed(3);

        const byteString = color.toByteString();
        this.mainColorEl.style.backgroundColor = `rgb(${byteString})`;

        this.byteColorEl.innerText = byteString;
        this.hexColorEl.innerText = color.toHexString();
        this.fractColorEl.innerText = color.toFractString();
        this.nonSrgbFractColorEl.innerText = color.toNonSrgbFractString();
    }

    randomizeColor() {
        this.setColor(rgb(
            Math.random(),
            Math.random(),
            Math.random(),
        ));
    }

    resetColor() {
        this.setColor(rgb(0.5, 0.5, 0.5), false);
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
