import { TAU, arccot } from "/shared/math.js";
import { Mesh } from "/shared/graphics.js"
import { Vec2 } from "./vec2.js";
import { Vec3 } from "./vec3.js";

export function quadMesh2d(gl) {
    return new Mesh(gl, {
        aPosition: [
            -1, -1,
            -1,  1,
             1,  1,
             1, -1,
        ],
        indexBuffer: [
            0, 3, 2,
            2, 1, 0,
        ],
        aUv: [
            0, 0,
            1, 0,
            1, 1,
            0, 1,
        ],
    });
}

export function quadMesh(gl) {
    return new Mesh(gl, {
        aPosition: [
            -1, -1, 0,
            -1,  1, 0,
             1,  1, 0,
             1, -1, 0,
        ],
        indexBuffer: [
            0, 3, 2,
            2, 1, 0,
        ],
        aUv: [
            0, 0,
            1, 0,
            1, 1,
            0, 1,
        ],
    });
}

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
        aPosition: positions.map(x => x.data).flat(),
        indexBuffer: indices,
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
        aPosition: positions.map(x => x.data).flat(),
        indexBuffer: indices,
    });
}

export function cubeMesh(gl) {
    const a = -.5;
    const z = .5;
    return new Mesh(gl, {
        aPosition: [
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
        indexBuffer: [
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
        aUv: [
            1, 0, 0, 0, 0, 1, 1, 1,
            1, 0, 0, 0, 0, 1, 1, 1,
            1, 0, 0, 0, 0, 1, 1, 1,
            1, 0, 0, 0, 0, 1, 1, 1,
            1, 0, 0, 0, 0, 1, 1, 1,
            1, 0, 0, 0, 0, 1, 1, 1,
        ],
        aNormal: [
            0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
            0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
            0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
            0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
            -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
            1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
        ],
    });
}

export function cylinderMesh(gl, segmentCount) {
    const positions = [];

    // top
    for (let i = 0; i < segmentCount; i++) {
        const angle = (i / segmentCount) * Math.PI * 2;
        positions.push(...Vec2.fromAngle(angle).extendZ(1).data);
    }
    // side
    for (let i = 0; i < segmentCount; i++) {
        const angle = (i / segmentCount) * Math.PI * 2;
        positions.push(...Vec2.fromAngle(angle).extendZ(1).data);
        positions.push(...Vec2.fromAngle(angle).extendZ(-1).data);
    }
    // bottom
    for (let i = 0; i < segmentCount; i++) {
        const angle = (i / segmentCount) * Math.PI * 2;
        positions.push(...Vec2.fromAngle(angle).extendZ(-1).data);
    }

    const indices = [];
    // top
    for (let i = 1; i < segmentCount - 1; i++) {
        indices.push(0);
        indices.push(i);
        indices.push(i + 1);
    }
    // side
    for (let i = 0; i < segmentCount * 2; i += 2) {
        const base = segmentCount;
        const offset = base + i;

        if (i < (segmentCount - 1) * 2) {
            indices.push(offset + 0);
            indices.push(offset + 1);
            indices.push(offset + 2);

            indices.push(offset + 2);
            indices.push(offset + 1);
            indices.push(offset + 3);
        } else {
            // connect to beginning points
            indices.push(offset + 0);
            indices.push(offset + 1);
            indices.push(base);

            indices.push(base);
            indices.push(offset + 1);
            indices.push(base + 1);
        }
    }
    //bottom
    for (let i = 1; i < segmentCount - 1; i++) {
        const base = segmentCount * 3;
        indices.push(base + i + 1);
        indices.push(base + i);
        indices.push(base);
    }

    const normals = [];
    // top
    for (let i = 0; i < segmentCount; i++) {
        normals.push(...Vec3.back().data);
    }
    // side
    for (let i = 0; i < segmentCount; i++) {
        const angle = (i / segmentCount) * Math.PI * 2;
        normals.push(...Vec2.fromAngle(angle).extendZ(0).data);
        normals.push(...Vec2.fromAngle(angle).extendZ(0).data);
    }
    // bottom
    for (let i = 0; i < segmentCount; i++) {
        normals.push(...Vec3.forward().data);
    }

    const uvs = [];
    for (let i = 0; i < segmentCount; i++) {
        const angle = (i / segmentCount) * Math.PI * 2;
        uvs.push(...Vec2.fromAngle(angle).addMut(Vec2.one()).scaleMut(.5).data);
    }
    // side
    for (let i = 0; i < segmentCount; i++) {
        const progress = i / segmentCount;
        uvs.push(...[progress, 0]);
        uvs.push(...[progress, 1]);
    }
    // bottom
    for (let i = 0; i < segmentCount; i++) {
        const angle = (i / segmentCount) * Math.PI * 2;
        uvs.push(...Vec2.fromAngle(angle).addMut(Vec2.one()).scaleMut(.5).data);
    }

    return new Mesh(gl, {
        aPosition: positions,
        aNormal: normals,
        aUv: uvs,
        indexBuffer: indices,
    });
}

export function icosahedronMesh(gl) {
    const positions = [];
    const normals = [];
    const angle = arccot(.5);
    const height = Math.cos(angle);
    const radius = Math.sin(angle);

    for (let i = 0; i < 5; i++) {
        const top = Vec3.up();
        const bottomLeft = Vec2.fromAngle((i / 5) * Math.PI * 2).scaleMut(radius).extendY(height);
        const bottomRight = Vec2.fromAngle(((i + 1) / 5) * Math.PI * 2).scaleMut(radius).extendY(height);

        positions.push(top);
        positions.push(bottomRight);
        positions.push(bottomLeft);

        const normal = top.add(bottomLeft).add(bottomRight).normalize();
        normals.push(normal);
        normals.push(normal);
        normals.push(normal);
    }
    for (let i = 0; i < 5; i++) {
        const bottom = Vec3.down();
        const topLeft = Vec2.fromAngle(((i + .5) / 5) * Math.PI * 2).scaleMut(radius).extendY(-height);
        const topRight = Vec2.fromAngle(((i + 1.5) / 5) * Math.PI * 2).scaleMut(radius).extendY(-height);

        positions.push(bottom);
        positions.push(topLeft);
        positions.push(topRight);

        const normal = bottom.add(topLeft).add(topRight).normalize();
        normals.push(normal);
        normals.push(normal);
        normals.push(normal);
    }
    for (let i = 0; i < 5; i++) {
        const topLeft = Vec2.fromAngle((i / 5) * Math.PI * 2).scaleMut(radius).extendY(height);
        const bottom= Vec2.fromAngle(((i + .5) / 5) * Math.PI * 2).scaleMut(radius).extendY(-height);
        const topRight= Vec2.fromAngle(((i + 1) / 5) * Math.PI * 2).scaleMut(radius).extendY(height);

        positions.push(topLeft);
        positions.push(topRight);
        positions.push(bottom);

        const normal = topLeft.add(topRight).add(bottom).normalize();
        normals.push(normal);
        normals.push(normal);
        normals.push(normal);
    }
    for (let i = 0; i < 5; i++) {
        const bottomLeft = Vec2.fromAngle(((i + .5) / 5) * Math.PI * 2).scaleMut(radius).extendY(-height);
        const top = Vec2.fromAngle(((i + 1) / 5) * Math.PI * 2).scaleMut(radius).extendY(height);
        const bottomRight = Vec2.fromAngle(((i + 1.5) / 5) * Math.PI * 2).scaleMut(radius).extendY(-height);

        positions.push(bottomLeft);
        positions.push(top);
        positions.push(bottomRight);

        const normal = bottomLeft.add(top).add(bottomRight).normalize();
        normals.push(normal);
        normals.push(normal);
        normals.push(normal);
    }

    const indices = [];
    for (let i = 0; i < 20; i++) {
        indices.push(i * 3);
        indices.push(i * 3 + 1);
        indices.push(i * 3 + 2);
    }

    return new Mesh(gl, {
        aPosition: positions.map(v => v.data).flat(),
        aNormal: normals.map(v => v.data).flat(),
        // TODO
        aUv: Array(positions.length * 2).fill(0),
        indexBuffer: indices,
    })
}