import * as Vec2 from "/shared/vec2.js";

const TAU = Math.PI * 2;

export function circle(segmentCount) {
    const segmentAngle = TAU / segmentCount;
    const vertices = [];
    for (let i = 0; i < segmentCount; i++) {
        vertices.push(Vec2.fromAngle(segmentAngle * i));
    }
    return vertices;
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