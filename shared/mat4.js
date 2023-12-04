export class Mat4 {
    constructor(data) {
        this.data = data;
    }

    static empty() {
        return new Mat4(Array(16));
    }

    static identity() {
        return new Mat4([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ]);
    }

    static translation(x, y, z) {
        return new Mat4([
            1, 0, 0, x,
            0, 1, 0, y,
            0, 0, 1, z,
            0, 0, 0, 1,
        ]);
    }

    static scalar(x, y, z) {
        return new Mat4([
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1,
        ]);
    }

    static rotationX(angle) {
        return new Mat4([
            1, 0, 0, 0,
            0, Math.cos(angle), -Math.sin(angle), 0,
            0, Math.sin(angle), Math.cos(angle), 0,
            0, 0, 0, 1,
        ]);
    }

    static rotationY(angle) {
        return new Mat4([
            Math.cos(angle), 0, Math.sin(angle), 0,
            0, 1, 0, 0,
            -Math.sin(angle), 0, Math.cos(angle), 0,
            0, 0, 0, 1,
        ]);
    }

    static rotationZ(angle) {
        return new Mat4([
            Math.cos(angle), -Math.sin(angle), 0, 0,
            Math.sin(angle), Math.cos(angle), 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ]);
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

    translate(x, y, z) {
        return this.mul(Mat4.translation(x, y, z));
    }

    scale(x, y, z) {
        return this.mul(Mat4.scalar(x, y, z));
    }

    rotate(x, y, z) {
        return this
            .mul(Mat4.rotationX(x))
            .mul(Mat4.rotationY(y))
            .mul(Mat4.rotationZ(z));
    }
}