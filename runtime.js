const DEFAULT_PIXEL_SIZE = 3;

document.addEventListener("DOMContentLoaded", () => {
    let theme = localStorage.getItem("theme");
    if (theme === null) {
        localStorage.setItem("theme", "light");
        theme = "light";
    }
    document.documentElement.setAttribute('data-theme', theme);
});

// Images are available after window load.
window.addEventListener("load", () => {
    const images = document.getElementsByClassName("pixel-art");
    for (const image of images) {
        const pixelSize = getPixelSize(image) ?? DEFAULT_PIXEL_SIZE;
        const boundingRect = image.getBoundingClientRect();
        image.style.width = `${boundingRect.width * pixelSize}px`;
        image.style.height = `${boundingRect.height * pixelSize}px`;
        image.style.visibility = "visible";
    }
});

function getPixelSize(element) {
    if (element.classList.contains("pixel-art-1")) {
        return 1;
    }
    if (element.classList.contains("pixel-art-2")) {
        return 2;
    }
    if (element.classList.contains("pixel-art-3")) {
        return 3;
    }
    if (element.classList.contains("pixel-art-4")) {
        return 4;
    }
}

