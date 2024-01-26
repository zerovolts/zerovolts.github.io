export function mountEl(el, children) {
    clearEl(el);
    for (const child of children) {
        el.appendChild(child);
    }
    return el;
}

function clearEl(el) {
    while (el.firstChild !== null) {
        el.removeChild(el.firstChild);
    }
}

export function createEl(tag, attrs, children) {
    const el = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) {
        el.setAttribute(key, value);
    }
    for (const child of children) {
        el.appendChild(child);
    }
    return el;
}

// Elements

export function text(str) {
    return document.createTextNode(str);
}

export function div(attrs, children) {
    return createEl("div", attrs, children);
}

export function span(attrs, children) {
    return createEl("span", attrs, children);
}