import { TAU } from "/shared/math.js";
import { pipe } from "/shared/util.js";
import { Mesh } from "/shared/graphics.js"
import * as Vec2 from "/shared/vec2.js";

export function circleMesh(gl, radius, segmentCount) {
    const segmentAngle = TAU / segmentCount;

    const positions = [];
    for (let i = 0; i < segmentCount; i++) {
        pipe(
            Vec2.fromAngle(segmentAngle * i),
            v => Vec2.scale(v, radius),
            v => positions.push(v),
        );
    }

    const indices = [];
    for (let i = 1; i < segmentCount - 1; i++) {
        indices.push(0);
        indices.push(i);
        indices.push(i + 1);
    }

    return new Mesh(gl, {
        position: positions.flat(),
        index: indices,
    });
}

export function lineMesh(gl, start, end, width, segmentCount, rounded = false) {
    const halfWidth = width / 2;
    const lineAngle = Vec2.angleBetween(start, end);
    const leftOffset = Vec2.scaleMut(Vec2.fromAngle(lineAngle + (Math.PI / 2)), halfWidth);
    const rightOffset = leftOffset.map(x => -x);
    const segmentAngle = (1 / segmentCount) * TAU;

    const positions = []
    positions.push(Vec2.add(start, leftOffset));
    if (rounded) {
        for (let i = 1; i < segmentCount / 2; i++) {
            const angle = lineAngle + (Math.PI / 2) + (segmentAngle * i);
            positions.push(Vec2.addMut(Vec2.scaleMut(Vec2.fromAngle(angle), halfWidth), start));
        }
    }
    positions.push(Vec2.add(start, rightOffset));
    positions.push(Vec2.add(end, rightOffset));
    if (rounded) {
        for (let i = 1; i < segmentCount / 2; i++) {
            const angle = lineAngle - (Math.PI / 2) + (segmentAngle * i);
            positions.push(Vec2.addMut(Vec2.scaleMut(Vec2.fromAngle(angle), halfWidth), end));
        }
    }
    positions.push(Vec2.add(end, leftOffset));

    const indices = [];
    for (let i = 1; i < (segmentCount + 2) - 1; i++) {
        indices.push(0);
        indices.push(i);
        indices.push(i + 1);
    }

    return new Mesh(gl, {
        position: positions.flat(),
        index: indices,
    });
}

export function cubeMesh(gl) {
    const a = -.5;
    const z = .5;
    return new Mesh(gl, {
        position: [
            // Front
            a, a, a,
            a, z, a,
            z, z, a,
            z, a, a,
            // Back
            z, a, z,
            z, z, z,
            a, z, z,
            a, a, z,
            // Top
            a, a, z,
            a, a, a,
            z, a, a,
            z, a, z,
            // Bottom
            a, z, a,
            a, z, z,
            z, z, z,
            z, z, a,
            // Left
            a, a, z,
            a, z, z,
            a, z, a,
            a, a, a,
            // Right
            z, a, a,
            z, z, a,
            z, z, z,
            z, a, z,
        ],
        index: [
            // Front
            0, 1, 2,
            2, 3, 0,
            // Back
            4, 5, 6,
            6, 7, 4,
            // Top
            8, 9, 10,
            10, 11, 8,
            // Bottom
            12, 13, 14,
            14, 15, 12,
            // Left
            16, 17, 18,
            18, 19, 16,
            // Right
            20, 21, 22,
            22, 23, 20,
        ],
        uv: [
            1, 0, 0, 0, 0, 1, 1, 1,
            1, 0, 0, 0, 0, 1, 1, 1,
            1, 0, 0, 0, 0, 1, 1, 1,
            1, 0, 0, 0, 0, 1, 1, 1,
            1, 0, 0, 0, 0, 1, 1, 1,
            1, 0, 0, 0, 0, 1, 1, 1,
        ],
        normal: [
            0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
            0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
            0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
            0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
            -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
            1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
        ],
    });
}