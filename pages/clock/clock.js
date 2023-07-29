import { GlApp } from "../../shared/gl-app.js"
import { circle, roundedLine } from "/shared/geometry.js";
import { createShaderProgram, getAttributeLocations, getUniformLocations } from "/shared/graphics.js";
import * as Vec2 from "/shared/vec2.js";
import * as Vec3 from "/shared/vec3.js";

const TAU = Math.PI * 2;

const COLOR_WHITE = [1.0, 1.0, 1.0, 1.0];
const COLOR_BLACK = [0.17, 0.24, 0.31, 1.0];
const COLOR_ACCENT = [1.0, 0.42, 0.31, 1.0];

// Initiate the fetch first to reduce perceived loading.
let shaderSources = Promise.all([
    fetch("/shared/default.vert").then(res => res.text()),
    fetch("/pages/clock/flat_color.frag").then(res => res.text()),
]);

document.addEventListener("DOMContentLoaded", async () => {
    shaderSources = await shaderSources;

    const canvas = document.getElementById("main-canvas");
    const app = new BezierApp(canvas);
    app.run();
});

class BezierApp extends GlApp {
    setup(gl) {
        gl.clearColor(0.1, 0.1, 0.1, 0.0);
        gl.clearDepth(1.0);

        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        const [vertexSource, fragmentSource] = shaderSources;
        this.shaderProgram = createShaderProgram(gl, vertexSource, fragmentSource);
        this.attributeLocations = getAttributeLocations(gl, this.shaderProgram, ["position"]);
        this.uniformLocations = getUniformLocations(gl, this.shaderProgram, ["color"]);

        this.shouldRender = true;
    }

    update(_delta) {
        const quarterTurn = TAU / 4;
        const date = new Date();
        this.secondHandRadians = -((date.getSeconds() / 60) * TAU - quarterTurn);
        this.minuteHandRadians = -((date.getMinutes() / 60) * TAU - quarterTurn);
        this.hourHandRadians = -((date.getHours() % 12 / 12) * TAU - quarterTurn);

        if (this.oldSeconds !== date.getSeconds()) {
            this.shouldRender = true;
        }
        this.oldSeconds = date.getSeconds();
    }

    render(gl) {
        if (!this.shouldRender) { return; }
        this.shouldRender = false;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(this.shaderProgram);

        // Background
        {
            gl.uniform4fv(this.uniformLocations.color, COLOR_BLACK);

            const positions = new Float32Array(circle(100).map(v => Vec2.extend(v, 0)).flat());

            const positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

            gl.vertexAttribPointer(this.attributeLocations.position, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(this.attributeLocations.position);

            gl.drawArrays(gl.TRIANGLE_FAN, 0, positions.length / 3);
        }

        // Clock Face
        {
            gl.uniform4fv(this.uniformLocations.color, COLOR_WHITE);

            const positions = new Float32Array(circle(100).map(v => Vec2.extend(v, 0)).map(v => Vec3.scaleMut(v, 0.95)).flat());

            const positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

            gl.vertexAttribPointer(this.attributeLocations.position, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(this.attributeLocations.position);

            gl.drawArrays(gl.TRIANGLE_FAN, 0, positions.length / 3);
        }

        // Minute Markers
        for (let i = 0; i < 60; i++) {
            const radians = (i / 60) * TAU;
            const width = i % 5 === 0 ? 0.02 : 0.01;
            const start = i % 5 === 0 ? 0.8 : 0.85;

            gl.uniform4fv(this.uniformLocations.color, COLOR_BLACK);

            const vectors = roundedLine(
                Vec2.scaleMut(Vec2.fromAngle(radians), start),
                Vec2.scaleMut(Vec2.fromAngle(radians), 0.9),
                width,
                10,
            );
            const positions = new Float32Array(vectors.map(v => Vec2.extend(v, 0)).flat());

            const positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

            gl.vertexAttribPointer(this.attributeLocations.position, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(this.attributeLocations.position);

            gl.drawArrays(gl.TRIANGLE_FAN, 0, positions.length / 3);
        }

        // Hour Hand
        {
            gl.uniform4fv(this.uniformLocations.color, COLOR_BLACK);

            const vectors = roundedLine(
                Vec2.zero(),
                Vec2.scaleMut(Vec2.fromAngle(this.hourHandRadians), 0.4),
                0.03,
                10,
            );
            const positions = new Float32Array(vectors.map(v => Vec2.extend(v, 0)).flat());

            const positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

            gl.vertexAttribPointer(this.attributeLocations.position, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(this.attributeLocations.position);

            gl.drawArrays(gl.TRIANGLE_FAN, 0, positions.length / 3);
        }

        // Minute Hand
        {
            gl.uniform4fv(this.uniformLocations.color, COLOR_BLACK);

            const vectors = roundedLine(
                Vec2.zero(),
                Vec2.scaleMut(Vec2.fromAngle(this.minuteHandRadians), 0.70),
                0.02,
                10,
            );
            const positions = new Float32Array(vectors.map(v => Vec2.extend(v, 0)).flat());

            const positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

            gl.vertexAttribPointer(this.attributeLocations.position, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(this.attributeLocations.position);

            gl.drawArrays(gl.TRIANGLE_FAN, 0, positions.length / 3);
        }

        // Second Hand
        {
            gl.uniform4fv(this.uniformLocations.color, COLOR_ACCENT);

            const vectors = roundedLine(
                Vec2.zero(),
                Vec2.scaleMut(Vec2.fromAngle(this.secondHandRadians), 0.9),
                0.01,
                10,
            );
            const positions = new Float32Array(vectors.map(v => Vec2.extend(v, 0)).flat());

            const positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

            gl.vertexAttribPointer(this.attributeLocations.position, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(this.attributeLocations.position);

            gl.drawArrays(gl.TRIANGLE_FAN, 0, positions.length / 3);
        }

        // Center Hand Cover
        {
            gl.uniform4fv(this.uniformLocations.color, COLOR_BLACK);

            const positions = new Float32Array(circle(20).map(v => Vec2.extend(v, 0)).map(v => Vec3.scaleMut(v, 0.03)).flat());

            const positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

            gl.vertexAttribPointer(this.attributeLocations.position, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(this.attributeLocations.position);

            gl.drawArrays(gl.TRIANGLE_FAN, 0, positions.length / 3);
        }
    }
}