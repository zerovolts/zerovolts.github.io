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