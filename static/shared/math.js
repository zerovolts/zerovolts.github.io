export const lerp = (from, to, x) => {
    const span = to - from;
    return from + (span * x);
};

export const quadLerp = (from, ctrl, to, x) => {
    const fromLerp = lerp(from, ctrl, x);
    const toLerp = lerp(ctrl, to, x);
    return lerp(fromLerp, toLerp, x);
}

export const cubicLerp = (from, fromCtrl, toCtrl, to, x) => {
    const fromLerp = quadLerp(from, fromCtrl, toCtrl, x);
    const toLerp = quadLerp(fromCtrl, toCtrl, to, x);
    return lerp(fromLerp, toLerp, x);
}

export const remap = (inMin, inMax, outMin, outMax, x) => {
    const inRange = inMax - inMin;
    const outRange = outMax - outMin;
    return (x * (outRange / inRange)) + (outMin - inMin);
}

export const randomRange = (min, max) => {
    const range = max - min;
    return Math.random() * range + min;
}
