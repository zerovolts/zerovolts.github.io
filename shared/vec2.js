import { VecBase } from "./vec-base.js";
import { v3 } from "./vec3.js";
import { lerp } from "./math.js";

export function v2(x, y) { return new Vec2(x, y); }

export class Vec2 extends VecBase {
    static zero() { return v2(0, 0); }
    static one() { return v2(1, 1); }

    static right() { return v2(1, 0); }
    static left() { return v2(-1, 0); }
    static up() { return v2(0, 1); }
    static down() { return v2(0, -1); }

    constructor(x, y) {
        super();
        this.data = [x, y];
    }

    get x() {
        return this.data[0];
    }

    get y() {
        return this.data[1];
    }

    set x(value) {
        this.data[0] = value;
    }

    set y(value) {
        this.data[1] = value;
    }

    copy() {
        return v2(this.x, this.y);
    }

    dot(other) {
        return (this.x * other.x) + (this.y * other.y);
    }

    addMut(other) {
        this.x += other.x;
        this.y += other.y;
        return this;
    }

    subMut(other) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }

    scaleMut(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    // Vec2-specific functions

    static fromAngle(angle) {
        return v2(Math.cos(angle), Math.sin(angle));
    }

    static randomRange(min, max) {
        const range = max - min;
        return v2(
            Math.random() * range + min,
            Math.random() * range + min,
        );
    }

    /** Returns a random point on the unit circle. */
    static randomUnit() {
        return Vec2.fromAngle(Math.random() * Math.PI * 2);
    };

    toAngle() {
        return Math.atan2(this.y, this.x);
    }

    angleTo(to) {
        return to.sub(this).toAngle();
    }

    extend(z) {
        return v3(this.x, this.y, z);
    }

    lerp(to, progress) {
        return v2(
            lerp(this.x, to.x, progress),
            lerp(this.y, to.y, progress),
        );
    };
}
