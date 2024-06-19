import { VecBase } from "./vec-base.js";
import { v2 } from "./vec2.js";
import { lerp } from "./math.js";

export function v3(x, y, z) { return new Vec3([x, y, z]); }

export class Vec3 extends VecBase {
    static zero() { return v3(0, 0, 0); }
    static one() { return v3(1, 1, 1); }

    static right() { return v3(1, 0, 0); }
    static left() { return v3(-1, 0, 0); }
    static up() { return v3(0, 1, 0); }
    static down() { return v3(0, -1, 0); }
    static back() { return v3(0, 0, 1); }
    static forward() { return v3(0, 0, -1); }

    get x() {
        return this.data[0];
    }

    get y() {
        return this.data[1];
    }

    get z() {
        return this.data[2];
    }

    set x(value) {
        this.data[0] = value;
    }

    set y(value) {
        this.data[1] = value;
    }

    set z(value) {
        this.data[2] = value;
    }

    copy() {
        return v3(this.x, this.y, this.z);
    }

    addMut(other) {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
        return this;
    };

    subMut(other) {
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
        return this;
    };

    scaleMut(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        return this;
    };

    cross(other) {
        return v3(
            (this.y * other.z) - (this.z * other.y),
            (this.z * other.x) - (this.x * other.z),
            (this.x * other.y) - (this.y * other.x),
        );
    }

    dot(other) {
        return (this.x * other.x) + (this.y * other.y) + (this.z * other.z);
    };

    truncate() {
        return v2(this.x, this.y);
    }

    lerp(to, progress) {
        return v3(
            lerp(this.x, to.x, progress),
            lerp(this.y, to.y, progress),
            lerp(this.z, to.z, progress),
        );
    };

    toString() {
        return `[${this.data[0]}, ${this.data[1]}, ${this.data[2]}]`;
    }
}