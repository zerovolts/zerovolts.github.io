import { lerp as lerpScalar } from "/static/shared/math.js";

export const zero = () => [0, 0];
export const one = () => [1, 1];

export const right = () => [1, 0];
export const left = () => [-1, 0];
export const up = () => [0, 1];
export const down = () => [0, -1];

export const copy = (self) => [self[0], self[1]];

export const randomRange = (min, max) => {
    const range = max - min;
    return [
        Math.random() * range + min,
        Math.random() * range + min,
    ];
}

/** Returns a random point on the unit circle. */
export const randomUnit = () => {
    return fromAngle(Math.random() * Math.PI * 2);
};

export const fromAngle = (angle) => {
    return [Math.cos(angle), Math.sin(angle)];
};

export const toAngle = (self) => {
    return Math.atan2(self[1], self[0]);
};

export const angleBetween = (from, to) => {
    return toAngle(sub(to, from));
};

export const addMut = (self, other) => {
    self[0] += other[0];
    self[1] += other[1];
    return self;
};

export const add = (self, other) => {
    return addMut(copy(self), other);
};

export const subMut = (self, other) => {
    self[0] -= other[0];
    self[1] -= other[1];
    return self;
};

export const sub = (self, other) => {
    return subMut(copy(self), other);
};

export const scaleMut = (self, scalar) => {
    self[0] *= scalar;
    self[1] *= scalar;
    return self;
};

export const scale = (self, scalar) => {
    return scaleMut(copy(self), scalar);
};

export const dot = (self, other) => {
    return self[0] * other[0] + self[1] * other[1];
};

export const lengthSq = (self) => {
    return dot(self, self);
};

export const length = (self) => {
    return Math.sqrt(lengthSq(self));
};

export const normalize = (self) => {
    return scale(self, 1 / length(self));
};

export const lerp = (from, to, x) => {
    return [
        lerpScalar(from[0], to[0], x),
        lerpScalar(from[1], to[1], x),
    ];
};

export const quadLerp = (from, ctrl, to, x) => {
    return lerp(
        lerp(from, ctrl, x),
        lerp(ctrl, to, x),
        x
    );
}

export const cubicLerp = (from, ctrlFrom, ctrlTo, to, x) => {
    return lerp(
        quadLerp(from, ctrlFrom, ctrlTo, x),
        quadLerp(ctrlFrom, ctrlTo, to, x),
        x
    );
}