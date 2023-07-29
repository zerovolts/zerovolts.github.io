import { lerp as lerpScalar } from "./math.js";

export function zero() { return [0, 0]; }
export function one() { return [1, 1]; }

export function right() { return [1, 0]; }
export function left() { return [-1, 0]; }
export function up() { return [0, 1]; }
export function down() { return [0, -1]; }

export function copy(self) {
    return [self[0], self[1]];
}

export function randomRange(min, max) {
    const range = max - min;
    return [
        Math.random() * range + min,
        Math.random() * range + min,
    ];
}

/** Returns a random point on the unit circle. */
export function randomUnit() {
    return fromAngle(Math.random() * Math.PI * 2);
};

export function fromAngle(angle) {
    return [Math.cos(angle), Math.sin(angle)];
};

export function toAngle(self) {
    return Math.atan2(self[1], self[0]);
};

export function angleBetween(from, to) {
    return toAngle(sub(to, from));
};

export function addMut(self, other) {
    self[0] += other[0];
    self[1] += other[1];
    return self;
};

export function add(self, other) {
    return addMut(copy(self), other);
};

export function subMut(self, other) {
    self[0] -= other[0];
    self[1] -= other[1];
    return self;
};

export function sub(self, other) {
    return subMut(copy(self), other);
};

export function scaleMut(self, scalar) {
    self[0] *= scalar;
    self[1] *= scalar;
    return self;
};

export function scale(self, scalar) {
    return scaleMut(copy(self), scalar);
};

export function dot(self, other) {
    return (self[0] * other[0]) + (self[1] * other[1]);
};

export function lengthSq(self) {
    return dot(self, self);
};

export function length(self) {
    return Math.sqrt(lengthSq(self));
};

export function normalizeMut(self) {
    return scaleMut(self, 1 / length(self));
};

export function normalize(self) {
    return normalizeMut(copy(self))
};

export function extend([x, y], z) {
    return [x, y, z];
}

export function lerp(from, to, progress) {
    return [
        lerpScalar(from[0], to[0], progress),
        lerpScalar(from[1], to[1], progress),
    ];
};

export function quadLerp(from, ctrl, to, progress) {
    return lerp(
        lerp(from, ctrl, progress),
        lerp(ctrl, to, progress),
        progress,
    );
}

export function cubicLerp(from, ctrlFrom, ctrlTo, to, progress) {
    return lerp(
        quadLerp(from, ctrlFrom, ctrlTo, progress),
        quadLerp(ctrlFrom, ctrlTo, to, progress),
        progress,
    );
}