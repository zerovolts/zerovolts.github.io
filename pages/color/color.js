import { RgbColor, HsvColor, rgb, hsv } from "/shared/color.js"

class App {
    constructor() {
        this.encodeUrl = this.updateUrlWithRgbColor.bind(this);

        document.addEventListener("DOMContentLoaded", async () => {
            this.mainColorEl = document.getElementById("color-picker-display");

            this.byteColorEl = document.getElementById("byte-color");
            this.hexColorEl = document.getElementById("hex-color");
            this.fractColorEl = document.getElementById("normalized-color");
            this.nonSrgbFractColorEl = document.getElementById("normalized-non-srgb-color");

            this.rgbSliderEls = ["red-slider", "green-slider", "blue-slider"]
                .map(id => document.getElementById(id));
            this.rgbSliderLabelEls = ["red-slider-label", "green-slider-label", "blue-slider-label"]
                .map(id => document.getElementById(id));
            this.hsvSliderEls = ["hue-slider", "sat-slider", "val-slider"]
                .map(id => document.getElementById(id));
            this.hsvSliderLabelEls = ["hue-slider-label", "sat-slider-label", "val-slider-label"]
                .map(id => document.getElementById(id));

            for (const el of this.rgbSliderEls) {
                el.addEventListener("input", () => this.updateDocumentWithRgbColor(this.getRgbColorFromDocument()));
                el.addEventListener("mouseup", () => this.updateUrlWithRgbColor(this.getRgbColorFromDocument()));
            }

            for (const el of this.hsvSliderEls) {
                el.addEventListener("input", () => this.updateDocumentWithRgbColor(this.getHsvColorFromDocument().toRgb()));
                el.addEventListener("mouseup", () => this.updateUrlWithRgbColor(this.getHsvColorFromDocument().toRgb()));
            }

            this.updateDocumentWithRgbColor(this.getRgbColorFromUrl());
        });
    }

    updateUrlWithRgbColor(color) {
        const url = new URL(window.location);
        url.searchParams.set("c", color.toHex());
        window.history.replaceState(null, document.title, url.toString());
    }

    getRgbColorFromUrl() {
        const url = new URL(window.location);
        const hex = url.searchParams.get("c") ?? "7f7f7f";
        return RgbColor.fromHex(hex);
    }

    getRgbColorFromDocument() {
        return new RgbColor(this.rgbSliderEls.map(el => Number(el.value)));
    }

    getHsvColorFromDocument() {
        return new HsvColor(this.hsvSliderEls.map(el => Number(el.value)));
    }

    updateDocumentWithRgbColor(color, persistHsv = true) {
        const { r, g, b } = color;
        this.rgbSliderEls[0].value = r;
        this.rgbSliderEls[1].value = g;
        this.rgbSliderEls[2].value = b;

        const { h, s, v } = persistHsv
            ? color.toHsv(this.getHsvColorFromDocument())
            : color.toHsv();
        this.hsvSliderEls[0].value = h;
        this.hsvSliderEls[1].value = s;
        this.hsvSliderEls[2].value = v;

        // RGB slider background adjustment
        this.rgbSliderEls[0].style = makeGradientString(
            rgb(0, g, b),
            rgb(1, g, b),
        );
        this.rgbSliderEls[1].style = makeGradientString(
            rgb(r, 0, b),
            rgb(r, 1, b),
        );
        this.rgbSliderEls[2].style = makeGradientString(
            rgb(r, g, 0),
            rgb(r, g, 1),
        );

        // HSV slider background adjustment
        this.hsvSliderEls[0].style = makeGradientString(
            hsv(0, s, v).toRgb(),
            hsv(1 / 6, s, v).toRgb(),
            hsv(2 / 6, s, v).toRgb(),
            hsv(3 / 6, s, v).toRgb(),
            hsv(4 / 6, s, v).toRgb(),
            hsv(5 / 6, s, v).toRgb(),
            hsv(1, s, v).toRgb(),
        );
        this.hsvSliderEls[1].style = makeGradientString(
            hsv(h, 0, v).toRgb(),
            hsv(h, 1, v).toRgb(),
        );
        this.hsvSliderEls[2].style = makeGradientString(
            hsv(h, s, 0).toRgb(),
            hsv(h, s, 1).toRgb(),
        );

        this.rgbSliderLabelEls[0].innerText = r.toFixed(3);
        this.rgbSliderLabelEls[1].innerText = g.toFixed(3);
        this.rgbSliderLabelEls[2].innerText = b.toFixed(3);

        this.hsvSliderLabelEls[0].innerText = h.toFixed(3);
        this.hsvSliderLabelEls[1].innerText = s.toFixed(3);
        this.hsvSliderLabelEls[2].innerText = v.toFixed(3);

        const byteString = colorToByteString(color);
        this.mainColorEl.style.backgroundColor = `rgb(${byteString})`;

        this.byteColorEl.innerText = byteString;
        this.hexColorEl.innerText = color.toHex();
        this.fractColorEl.innerText = colorToNormalizedString(color);
        this.nonSrgbFractColorEl.innerText = colorToNormalizedNonSrgbString(color);
    }

    randomizeColor() {
        const color = rgb(Math.random(), Math.random(), Math.random());
        this.updateDocumentWithRgbColor(color);
        this.updateUrlWithRgbColor(color);
    }

    resetColor() {
        const color = rgb(0.5, 0.5, 0.5)
        this.updateDocumentWithRgbColor(color, false);
        this.updateUrlWithRgbColor(color);
    }

    copyByteValue() {
        navigator.clipboard.writeText(
            colorToByteString(this.getRgbColorFromDocument())
        );
    }

    copyHexValue() {
        navigator.clipboard.writeText(
            this.getRgbColorFromDocument().toHex()
        );
    }

    copyNormalizedValue() {
        navigator.clipboard.writeText(
            colorToNormalizedString(this.getRgbColorFromDocument())
        );
    }

    copyNormalizedNonSrgbValue() {
        navigator.clipboard.writeText(
            colorToNormalizedNonSrgbString(this.getRgbColorFromDocument())
        );
    }
}
window.app = new App();

function colorToByteString(color) {
    return color.toBytes().join(", ");
}

function colorToNormalizedString(color) {
    return color.data.map(c => c.toFixed(2)).join(", ")
}

function colorToNormalizedNonSrgbString(color) {
    return color.data.map(c => Math.pow(c, 2.2).toFixed(2)).join(", ")
}

function makeGradientString(...rgbColors) {
    const colorStrings = rgbColors.map(c => `#${c.toHex()}`);
    return `background: linear-gradient(90deg, ${colorStrings.join(", ")})`;
}