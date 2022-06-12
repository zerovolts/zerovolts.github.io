import { lerp as lerpScalar } from "/static/shared/math.js";

export const zero = () => [0, 0, 0];
export const one = () => [1, 1, 1];

export const right = () => [1, 0, 0];
export const left = () => [-1, 0, 0];
export const up = () => [0, 1, 0];
export const down = () => [0, -1, 0];
export const back = () => [0, 0, 1];
export const forward = () => [0, 0, -1];

export const copy = (self) => [self[0], self[1], self[2]];

export const addMut = (self, other) => {
    self[0] += other[0];
    self[1] += other[1];
    self[2] += other[2];
    return self;
};

export const add = (self, other) => {
    return addMut(copy(self), other);
};

export const subMut = (self, other) => {
    self[0] -= other[0];
    self[1] -= other[1];
    self[2] -= other[2];
    return self;
};

export const sub = (self, other) => {
    return subMut(copy(self), other);
};

export const scaleMut = (self, scalar) => {
    self[0] *= scalar;
    self[1] *= scalar;
    self[2] *= scalar;
    return self;
};

export const scale = (self, scalar) => {
    return scaleMut(copy(self), scalar);
};

export const cross = (self, other) => {
    return [
        self[1] * other[2] - self[2] * other[1],
        self[2] * other[0] - self[0] * other[2],
        self[0] * other[1] - self[1] * other[0],
    ];
}

export const dot = (self, other) => {
    return self[0] * other[0] + self[1] * other[1] + self[2] * other[2];
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
        lerpScalar(from[2], to[2], x),
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