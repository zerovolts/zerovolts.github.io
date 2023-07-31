export const TAU = Math.PI * 2;

export function lerp(from, to, x) {
    const span = to - from;
    return from + (span * x);
};

export function quadLerp(from, ctrl, to, x) {
    const fromLerp = lerp(from, ctrl, x);
    const toLerp = lerp(ctrl, to, x);
    return lerp(fromLerp, toLerp, x);
}

export function cubicLerp(from, fromCtrl, toCtrl, to, x) {
    const fromLerp = quadLerp(from, fromCtrl, toCtrl, x);
    const toLerp = quadLerp(fromCtrl, toCtrl, to, x);
    return lerp(fromLerp, toLerp, x);
}

export function remap(inMin, inMax, outMin, outMax, x) {
    const inRange = inMax - inMin;
    const outRange = outMax - outMin;
    return (x * (outRange / inRange)) + (outMin - inMin);
}

export function randomRange(min, max) {
    const range = max - min;
    return Math.random() * range + min;
}

export function clamp(value, min, max) {
    if (value < min) {
        return min;
    }
    if (value > max) {
        return max;
    }
    return value;
}