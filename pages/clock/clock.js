import { GlApp } from "../../shared/gl-app.js"
import { Circle, Line } from "/shared/geometry.js";
import { createShaderProgram, getAttributeLocations, getUniformLocations } from "/shared/graphics.js";
import * as Vec2 from "/shared/vec2.js";
import * as Mat4 from "/shared/mat4.js";

const TAU = Math.PI * 2;

const COLOR_WHITE = [1.0, 1.0, 1.0, 1.0];
const COLOR_BLACK = [0.17, 0.24, 0.31, 1.0];
const COLOR_ACCENT = [1.0, 0.42, 0.31, 1.0];

// Initiate the fetch first to reduce perceived loading.
let shaderSources = Promise.all([
    fetch("/pages/clock/hand.vert").then(res => res.text()),
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
        this.uniformLocations = getUniformLocations(gl, this.shaderProgram, ["color", "rotation"]);

        this.shouldRender = true;

        // Border
        {
            const positions = new Circle(1, Vec2.zero()).toVertexBuffer(100);
            this.border = {
                vertexCount: positions.length / 2,
                positionBuffer: gl.createBuffer(),
            };
            gl.bindBuffer(gl.ARRAY_BUFFER, this.border.positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
        }

        // Face
        {
            const positions = new Circle(0.95, Vec2.zero()).toVertexBuffer(100);
            this.face = {
                vertexCount: positions.length / 2,
                positionBuffer: gl.createBuffer(),
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, this.face.positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
        }

        // Marks
        this.marks = [];
        for (let i = 0; i < 60; i++) {
            const radians = (i / 60) * TAU;
            const width = i % 5 === 0 ? 0.02 : 0.01;
            const start = i % 5 === 0 ? 0.8 : 0.85;
            const positions = new Line(
                Vec2.scaleMut(Vec2.fromAngle(radians), start),
                Vec2.scaleMut(Vec2.fromAngle(radians), 0.9),
                width,
                true,
            ).toVertexBuffer(10);
            const mark = {
                vertexCount: positions.length / 2,
                positionBuffer: gl.createBuffer(),
            };
            this.marks.push(mark);
            gl.bindBuffer(gl.ARRAY_BUFFER, mark.positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
        }

        // Hour Hand
        {
            const positions = new Line(
                Vec2.scaleMut(Vec2.down(), 0.1),
                Vec2.scaleMut(Vec2.up(), 0.4),
                0.025,
                true,
            ).toVertexBuffer(10);
            this.hourHand = {
                vertexCount: positions.length / 2,
                positionBuffer: gl.createBuffer(),
            };
            gl.bindBuffer(gl.ARRAY_BUFFER, this.hourHand.positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
        }

        // Minute Hand
        {
            const positions = new Line(
                Vec2.scaleMut(Vec2.down(), 0.1),
                Vec2.scaleMut(Vec2.up(), 0.7),
                0.02,
                true,
            ).toVertexBuffer(10);
            this.minuteHand = {
                vertexCount: positions.length / 2,
                positionBuffer: gl.createBuffer(),
            };
            gl.bindBuffer(gl.ARRAY_BUFFER, this.minuteHand.positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
        }

        // Second Hand
        {
            const positions = new Line(
                Vec2.scaleMut(Vec2.down(), 0.1),
                Vec2.scaleMut(Vec2.up(), 0.9),
                0.01,
                true,
            ).toVertexBuffer(10);
            this.secondHand = {
                vertexCount: positions.length / 2,
                positionBuffer: gl.createBuffer(),
            };
            gl.bindBuffer(gl.ARRAY_BUFFER, this.secondHand.positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
        }

        // Second Hand Back
        {
            const positions = new Line(
                Vec2.scaleMut(Vec2.down(), 0.2),
                Vec2.scaleMut(Vec2.down(), 0.1),
                0.02,
                true,
            ).toVertexBuffer(10);
            this.secondHandBack = {
                vertexCount: positions.length / 2,
                positionBuffer: gl.createBuffer(),
            };
            gl.bindBuffer(gl.ARRAY_BUFFER, this.secondHandBack.positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
        }

        // Hand Cover
        {
            const positions = new Circle(0.03, Vec2.zero()).toVertexBuffer(20);
            this.handCover = {
                vertexCount: positions.length / 2,
                positionBuffer: gl.createBuffer(),
            };
            gl.bindBuffer(gl.ARRAY_BUFFER, this.handCover.positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
        }
    }

    update(_delta) {
        const date = new Date();
        this.secondHandRadians = -((date.getSeconds() / 60) * TAU);
        this.minuteHandRadians = -((date.getMinutes() / 60) * TAU);
        this.hourHandRadians = -((date.getHours() % 12 / 12) * TAU);

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

        const MAT4_IDENTITY = new Float32Array(Mat4.identity())

        // Border
        {
            gl.uniform4fv(this.uniformLocations.color, COLOR_BLACK);
            gl.uniformMatrix4fv(this.uniformLocations.rotation, false, MAT4_IDENTITY);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.border.positionBuffer);
            gl.vertexAttribPointer(this.attributeLocations.position, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(this.attributeLocations.position);
            gl.drawArrays(gl.TRIANGLE_FAN, 0, this.border.vertexCount);
        }

        // Face
        {
            gl.uniform4fv(this.uniformLocations.color, COLOR_WHITE);
            gl.uniformMatrix4fv(this.uniformLocations.rotation, false, MAT4_IDENTITY);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.face.positionBuffer);
            gl.vertexAttribPointer(this.attributeLocations.position, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(this.attributeLocations.position);
            gl.drawArrays(gl.TRIANGLE_FAN, 0, this.face.vertexCount);
        }

        // Marks
        for (const mark of this.marks) {
            gl.uniform4fv(this.uniformLocations.color, COLOR_BLACK);
            gl.uniformMatrix4fv(this.uniformLocations.rotation, false, MAT4_IDENTITY);
            gl.bindBuffer(gl.ARRAY_BUFFER, mark.positionBuffer);
            gl.vertexAttribPointer(this.attributeLocations.position, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(this.attributeLocations.position);
            gl.drawArrays(gl.TRIANGLE_FAN, 0, mark.vertexCount);
        }

        // Hour Hand
        {
            const rotationMatrix = new Float32Array(Mat4.fromAngle(this.hourHandRadians))
            gl.uniform4fv(this.uniformLocations.color, COLOR_BLACK);
            gl.uniformMatrix4fv(this.uniformLocations.rotation, false, rotationMatrix);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.hourHand.positionBuffer);
            gl.vertexAttribPointer(this.attributeLocations.position, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(this.attributeLocations.position);
            gl.drawArrays(gl.TRIANGLE_FAN, 0, this.hourHand.vertexCount);
        }

        // Minute Hand
        {
            const rotationMatrix = new Float32Array(Mat4.fromAngle(this.minuteHandRadians))
            gl.uniform4fv(this.uniformLocations.color, COLOR_BLACK);
            gl.uniformMatrix4fv(this.uniformLocations.rotation, false, rotationMatrix);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.minuteHand.positionBuffer);
            gl.vertexAttribPointer(this.attributeLocations.position, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(this.attributeLocations.position);
            gl.drawArrays(gl.TRIANGLE_FAN, 0, this.minuteHand.vertexCount);
        }

        // Second Hand
        {
            const rotationMatrix = new Float32Array(Mat4.fromAngle(this.secondHandRadians))
            gl.uniform4fv(this.uniformLocations.color, COLOR_ACCENT);
            gl.uniformMatrix4fv(this.uniformLocations.rotation, false, rotationMatrix);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.secondHand.positionBuffer);
            gl.vertexAttribPointer(this.attributeLocations.position, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(this.attributeLocations.position);
            gl.drawArrays(gl.TRIANGLE_FAN, 0, this.secondHand.vertexCount);
        }

        // Second Hand Back
        {
            const rotationMatrix = new Float32Array(Mat4.fromAngle(this.secondHandRadians))
            gl.uniform4fv(this.uniformLocations.color, COLOR_ACCENT);
            gl.uniformMatrix4fv(this.uniformLocations.rotation, false, rotationMatrix);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.secondHandBack.positionBuffer);
            gl.vertexAttribPointer(this.attributeLocations.position, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(this.attributeLocations.position);
            gl.drawArrays(gl.TRIANGLE_FAN, 0, this.secondHandBack.vertexCount);
        }

        // Hand Cover
        {
            gl.uniform4fv(this.uniformLocations.color, COLOR_BLACK);
            gl.uniformMatrix4fv(this.uniformLocations.rotation, false, MAT4_IDENTITY);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.handCover.positionBuffer);
            gl.vertexAttribPointer(this.attributeLocations.position, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(this.attributeLocations.position);
            gl.drawArrays(gl.TRIANGLE_FAN, 0, this.handCover.vertexCount);
        }
    }
}