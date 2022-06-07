import { createShaderProgram, getAttributeLocations, getUniformLocations } from "/shared/graphics.js";
import { angleBetweenPoints, cubicLerp, randRange } from "/shared/math.js";

// Initiate the fetch first to reduce perceived loading.
const shaderSources = Promise.all([
    fetch("./bezier.vert").then(res => res.text()),
    fetch("./bezier.frag").then(res => res.text()),
]);

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("main-canvas");
    const gl = canvas.getContext("webgl2");
    if (gl === null) return;

    render(gl, [canvas.clientWidth, canvas.clientHeight]);

    const button = document.getElementById("generate");
    button.onclick = () => render(gl, [canvas.clientWidth, canvas.clientHeight]);
});

const render = async (gl, dimensions) => {
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.clearDepth(1.0);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const [vertexSource, fragmentSource] = await shaderSources;
    const shaderProgram = createShaderProgram(gl, vertexSource, fragmentSource);
    const attributeLocations = getAttributeLocations(gl, shaderProgram, ["position"]);
    const uniformLocations = getUniformLocations(gl, shaderProgram, ["dimensions"]);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(shaderProgram);

    gl.uniform2fv(uniformLocations.dimensions, dimensions);

    for (let i = 0; i < 8; i++) {
        const extreme = dimensions[0] / 2;
        const from = [randRange(-extreme, extreme), randRange(-extreme, extreme)];
        const fromCtrl = [randRange(-extreme, extreme), randRange(-extreme, extreme)];
        const toCtrl = [randRange(-extreme, extreme), randRange(-extreme, extreme)];
        const to = [randRange(-extreme, extreme), randRange(-extreme, extreme)];

        const segments = 32;
        const path = Array(segments).fill(null).flatMap((_x, i) => ([
            cubicLerp(from[0], fromCtrl[0], toCtrl[0], to[0], i / segments),
            cubicLerp(from[1], fromCtrl[1], toCtrl[1], to[1], i / segments),
            Math.sin(((i / (segments - 1)) - 1) * Math.PI),
        ]));

        const positions = new Float32Array(extrudeLine(path, 4));

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

        gl.vertexAttribPointer(attributeLocations.position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(attributeLocations.position);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, positions.length / 3);
    }
};

/**
 * Expects a list of 3d vector components, but mostly ignores the z component.
 */
const extrudeLine = (points, width) => {
    const halfWidth = width / 2;

    const pointAngles = [angleBetweenPoints(points[0], points[1], points[3], points[4])];
    for (let i = 3; i < points.length - 3; i += 3) {
        const before = [points[i - 3], points[i - 2]];
        const position = [points[i], points[i + 1]];
        const after = [points[i + 3], points[i + 4]];

        const beforeAngle = angleBetweenPoints(before[0], before[1], position[0], position[1]);
        const afterAngle = angleBetweenPoints(position[0], position[1], after[0], after[1]);

        const angleDiff = afterAngle - beforeAngle;
        const flipped = angleDiff <= -Math.PI || angleDiff >= Math.PI

        if (flipped) {
            const largerAngle = Math.max(beforeAngle, afterAngle);
            const smallerAngle = Math.min(beforeAngle, afterAngle) + (Math.PI * 2);
            pointAngles.push((largerAngle + smallerAngle) / 2);
        } else {
            pointAngles.push((beforeAngle + afterAngle) / 2);
        }
    }
    pointAngles.push(angleBetweenPoints(points.at(-6), points.at(-5), points.at(-3), points.at(-2)));

    const extrudedPoints = [];
    for (let i = 0; i < pointAngles.length; i++) {
        const pointIndex = i * 3;
        const angle = pointAngles[i];

        const leftAngle = angle + (Math.PI / 2);
        const leftOffset = [Math.cos(leftAngle) * halfWidth, Math.sin(leftAngle) * halfWidth];
        const rightOffset = leftOffset.map(x => -x);
        const left = [points[pointIndex] + leftOffset[0], points[pointIndex + 1] + leftOffset[1], points[pointIndex + 2]];
        const right = [points[pointIndex] + rightOffset[0], points[pointIndex + 1] + rightOffset[1], points[pointIndex + 2]];

        extrudedPoints.push(...left);
        extrudedPoints.push(...right);
    }
    return extrudedPoints;
};