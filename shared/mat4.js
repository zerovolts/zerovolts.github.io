import { v3 } from "./vec3.js";

export function m4(
    x0, x1, x2, x3,
    x4, x5, x6, x7,
    x8, x9, x10, x11,
    x12, x13, x14, x15,
) {
    return new Mat4([
        x0, x1, x2, x3,
        x4, x5, x6, x7,
        x8, x9, x10, x11,
        x12, x13, x14, x15,
    ]);
}

export class Mat4 {
    constructor(data) {
        this.data = data;
    }

    static empty() {
        return new Mat4(Array(16));
    }

    static identity() {
        return m4(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        );
    }

    static fromBasisVectors(x, y, z) {
        return m4(
            x.x, x.y, x.z, 0,
            y.x, y.y, y.z, 0,
            z.x, z.y, z.z, 0,
            0,   0,   0,   1,
        );
    }

    static lookAt(position, target, up) {
        const forward = target.sub(position).scale(-1).normalize();
        const right = forward.cross(up).normalize();
        // guaranteed to be orthogonal to the other vectors
        const fixedUp = right.cross(forward).normalize();
        return Mat4.fromBasisVectors(right, fixedUp, forward);
    }

    static translation(x, y, z) {
        return m4(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1,
        );
    }

    static scalar(x, y, z) {
        return m4(
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1,
        );
    }

    static rotationX(angle) {
        return m4(
            1, 0, 0, 0,
            0, Math.cos(angle), -Math.sin(angle), 0,
            0, Math.sin(angle), Math.cos(angle), 0,
            0, 0, 0, 1,
        );
    }

    static rotationY(angle) {
        return m4(
            Math.cos(angle), 0, Math.sin(angle), 0,
            0, 1, 0, 0,
            -Math.sin(angle), 0, Math.cos(angle), 0,
            0, 0, 0, 1,
        );
    }

    static rotationZ(angle) {
        return m4(
            Math.cos(angle), -Math.sin(angle), 0, 0,
            Math.sin(angle), Math.cos(angle), 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        );
    }

    static projection(fov, aspect, near, far) {
        const f = 1 / Math.tan(fov / 2);
        const invRange = 1 / (near - far);

        return m4(
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (near + far) * invRange, -1,
            0, 0, near * far * invRange * 2, 0,
        );
    }

    get(x, y) {
        return this.data[x + y * 4];
    }

    set(x, y, value) {
        this.data[x + y * 4] = value;
    }

    mul(other) {
        const result = Mat4.empty();
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                let total = 0;
                for (let i = 0; i < 4; i++) {
                    total += this.get(i, y) * other.get(x, i);
                }
                result.set(x, y, total);
            }
        }
        return result;
    }

    // TODO: This should take and emit a Vec4.
    mulVec(v) {
        return v3(
            v3(this.data[0], this.data[1], this.data[2]).dot(v),
            v3(this.data[4], this.data[5], this.data[6]).dot(v),
            v3(this.data[8], this.data[9], this.data[10]).dot(v),
        );
    }

    translate(x, y, z) {
        return this.mul(Mat4.translation(x, y, z));
    }

    scale(x, y, z) {
        return this.mul(Mat4.scalar(x, y, z));
    }

    rotateX(angle) {
        return this.mul(Mat4.rotationX(angle));
    }

    rotateY(angle) {
        return this.mul(Mat4.rotationY(angle));
    }

    rotateZ(angle) {
        return this.mul(Mat4.rotationZ(angle));
    }

    project(fov, aspect, near, far) {
        return this.mul(Mat4.projection(fov, aspect, near, far));
    }

    toString() {
        return [
            `[${this.data[0 ]}, ${this.data[1 ]}, ${this.data[2 ]}, ${this.data[3 ]}]`,
            `[${this.data[4 ]}, ${this.data[5 ]}, ${this.data[6 ]}, ${this.data[7 ]}]`,
            `[${this.data[8 ]}, ${this.data[9 ]}, ${this.data[10]}, ${this.data[11]}]`,
            `[${this.data[12]}, ${this.data[13]}, ${this.data[14]}, ${this.data[15]}]`,
        ].join("\n");
    }

    translation() {
        return v3(this.data[12], this.data[13], this.data[14]);
    }
}