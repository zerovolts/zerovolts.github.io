import { createShaderProgram, getAttributeLocations, getUniformLocations } from "/static/shared/graphics.js";
import * as Vec2 from "/static/shared/vec2.js";
import * as Vec3 from "/static/shared/vec3.js";

// Initiate the fetch first to reduce perceived loading.
const shaderSources = Promise.all([
    fetch("/static/pages/bezier/bezier.vert").then(res => res.text()),
    fetch("/static/pages/bezier/bezier.frag").then(res => res.text()),
]);

document.addEventListener("DOMContentLoaded", () => {
    /** @type HTMLCanvasElement */
    const canvas = document.getElementById("main-canvas");
    const gl = canvas.getContext("webgl2");
    if (gl === null) return;

    render(gl, [canvas.clientWidth, canvas.clientHeight]);

    const button = document.getElementById("generate");
    button.onclick = () => render(gl, [canvas.clientWidth, canvas.clientHeight]);
});

/**
 * @param {WebGL2RenderingContext} gl 
 */
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
        const from = Vec2.randomRange(-extreme, extreme);
        const fromCtrl = Vec2.randomRange(-extreme, extreme);
        const toCtrl = Vec2.randomRange(-extreme, extreme);
        const to = Vec2.randomRange(-extreme, extreme);

        const segments = 32;
        const path = [];
        for (let i = 0; i < segments; i++) {
            path.push([
                ...Vec2.cubicLerp(from, fromCtrl, toCtrl, to, i / segments),
                Math.sin(((i / (segments - 1)) - 1) * Math.PI),
            ]);
        }

        const positions = new Float32Array(extrudeLine(path, 4).flat());

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

        gl.vertexAttribPointer(attributeLocations.position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(attributeLocations.position);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, positions.length / 3);
    }
};

/**
 * Expects a list of 3d vectors, but mostly ignores the z component.
 */
const extrudeLine = (points, width) => {
    const pointAngles = [Vec2.angleBetween(points[0], points[1])];
    // Iterate over all but the first and last.
    for (let i = 1; i < points.length - 1; i++) {
        const before = points[i - 1];
        const position = points[i];
        const after = points[i + 1];

        const beforeAngle = Vec2.angleBetween(before, position);
        const afterAngle = Vec2.angleBetween(position, after);

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
    pointAngles.push(Vec2.angleBetween(points.at(-2), points.at(-1)));

    const extrudedPoints = [];
    for (let i = 0; i < points.length; i++) {
        const point = points[i];
        const angle = pointAngles[i];

        const leftOffset = [...Vec2.scale(Vec2.fromAngle(angle + (Math.PI / 2)), width / 2), 0];
        const rightOffset = leftOffset.map(x => -x);

        const leftPoint = Vec3.add(point, leftOffset);
        const rightPoint = Vec3.add(point, rightOffset)

        extrudedPoints.push(leftPoint);
        extrudedPoints.push(rightPoint);
    }
    return extrudedPoints;
};