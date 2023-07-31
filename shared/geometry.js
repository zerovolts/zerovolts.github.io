import { pipe } from "/shared/util.js"
import * as Vec2 from "/shared/vec2.js";

const TAU = Math.PI * 2;

export class Circle {
    constructor(radius, position) {
        this.radius = radius;
        this.position = position;
    }

    toVec2(segmentCount) {
        const segmentAngle = TAU / segmentCount;
        const vertices = [];
        for (let i = 0; i < segmentCount; i++) {
            pipe(
                Vec2.fromAngle(segmentAngle * i),
                v => Vec2.scale(v, this.radius),
                v => Vec2.add(v, this.position),
                v => vertices.push(v),
            );
        }
        return vertices;
    }

    toVertexBuffer(segmentCount) {
        return new Float32Array(this.toVec2(segmentCount).flat())
    }
}

export function roundedLine(start, end, width, segmentCount) {
    const halfWidth = width / 2;
    const lineAngle = Vec2.angleBetween(start, end);
    const leftOffset = Vec2.scaleMut(Vec2.fromAngle(lineAngle + (Math.PI / 2)), halfWidth);
    const rightOffset = leftOffset.map(x => -x);
    const segmentAngle = (1 / segmentCount) * TAU;

    const vertices = []
    vertices.push(Vec2.add(start, leftOffset));
    for (let i = 1; i < segmentCount / 2; i++) {
        const angle = lineAngle + (Math.PI / 2) + (segmentAngle * i);
        vertices.push(Vec2.addMut(Vec2.scaleMut(Vec2.fromAngle(angle), halfWidth), start));
    }
    vertices.push(Vec2.add(start, rightOffset));
    vertices.push(Vec2.add(end, rightOffset));
    for (let i = 1; i < segmentCount / 2; i++) {
        const angle = lineAngle - (Math.PI / 2) + (segmentAngle * i);
        vertices.push(Vec2.addMut(Vec2.scaleMut(Vec2.fromAngle(angle), halfWidth), end));
    }
    vertices.push(Vec2.add(end, leftOffset));

    return vertices;
}