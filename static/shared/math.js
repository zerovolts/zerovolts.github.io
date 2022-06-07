
export const angleBetweenPoints = (x1, y1, x2, y2) => {
    let angle = Math.atan2(y2 - y1, x2 - x1);
    if (angle < 0) {
        return angle + (Math.PI * 2);
    }
    return angle;
};

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

export const randRange = (min, max) => {
    const range = max - min;
    return min + (Math.random() * range);
}
