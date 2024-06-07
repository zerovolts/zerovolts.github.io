export function pipe(value, ...fns) {
    let acc = value;
    for (const fn of fns) {
        acc = fn(acc);
    }
    return acc;
}

export function loadImage(src) {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

export function assert(condition, message) {
    if (condition) return;
    console.error("Assertion failed:", message);
    debugger;
}

export function assertEq(actual, expected) {
    assert(actual === expected, `Expected ${actual} to equal ${expected}`);
}