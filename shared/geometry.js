import { TAU } from "/shared/math.js";
import { Mesh } from "/shared/graphics.js"
import { Vec2 } from "./vec2.js";

export function circleMesh(gl, radius, segmentCount) {
    const segmentAngle = TAU / segmentCount;

    const positions = [];
    for (let i = 0; i < segmentCount; i++) {
        positions.push(Vec2.fromAngle(segmentAngle * i).scaleMut(radius));
    }

    const indices = [];
    for (let i = 1; i < segmentCount - 1; i++) {
        indices.push(0);
        indices.push(i);
        indices.push(i + 1);
    }

    return new Mesh(gl, {
        position: positions.map(x => x.data).flat(),
        index: indices,
    });
}

export function lineMesh(gl, start, end, width, segmentCount, rounded = false) {
    const halfWidth = width / 2;
    const lineAngle = start.angleTo(end);
    const leftOffset = Vec2.fromAngle(lineAngle + (Math.PI / 2)).scaleMut(halfWidth);
    const rightOffset = leftOffset.scale(-1);
    const segmentAngle = (1 / segmentCount) * TAU;

    const positions = []
    positions.push(start.add(leftOffset));
    if (rounded) {
        for (let i = 1; i < segmentCount / 2; i++) {
            const angle = lineAngle + (Math.PI / 2) + (segmentAngle * i);
            positions.push(Vec2.fromAngle(angle).scaleMut(halfWidth).addMut(start));
        }
    }
    positions.push(start.add(rightOffset));
    positions.push(end.add(rightOffset));
    if (rounded) {
        for (let i = 1; i < segmentCount / 2; i++) {
            const angle = lineAngle - (Math.PI / 2) + (segmentAngle * i);
            positions.push(Vec2.fromAngle(angle).scaleMut(halfWidth).addMut(end));
        }
    }
    positions.push(end.add(leftOffset));

    const indices = [];
    for (let i = 1; i < (segmentCount + 2) - 1; i++) {
        indices.push(0);
        indices.push(i);
        indices.push(i + 1);
    }

    return new Mesh(gl, {
        position: positions.map(x => x.data).flat(),
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