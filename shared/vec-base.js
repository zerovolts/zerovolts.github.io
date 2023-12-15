export class VecBase {
    constructor(data) {
        this.data = data;
    }

    lengthSq() {
        return this.dot(this);
    }

    length() {
        return Math.sqrt(this.lengthSq());
    }

    normalizeMut() {
        return this.scaleMut(1 / this.length());
    }

    normalize() {
        return this.copy().normalizeMut();
    }

    add(other) {
        return this.copy().addMut(other);
    }

    sub(other) {
        return this.copy().subMut(other);
    };

    scale(scalar) {
        return this.copy().scaleMut(scalar);
    }

    quadLerp(ctrl, to, progress) {
        return this.lerp(ctrl, progress).lerp(
            ctrl.lerp(to, progress),
            progress,
        );
    }

    cubicLerp(ctrlFrom, ctrlTo, to, progress) {
        return this.quadLerp(ctrlFrom, ctrlTo, progress).lerp(
            ctrlFrom.quadLerp(ctrlTo, to, progress),
            progress,
        );
    }
}