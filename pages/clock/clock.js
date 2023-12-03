import { TAU } from "/shared/math.js"
import { GlApp } from "/shared/gl-app.js"
import { circleMesh, lineMesh } from "/shared/geometry.js";
import { ShaderProgram, draw } from "/shared/graphics.js";
import * as Vec2 from "/shared/vec2.js";
import { Mat4 } from "/shared/mat4.js";

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
        this.shaderProgram = new ShaderProgram(
            gl,
            vertexSource,
            fragmentSource,
            { aPosition: "2f" },
            { uColor: "4f", uRotation: "m4f" },
        );

        this.shouldRender = true;

        this.borderMesh = circleMesh(gl, 1, 100);
        this.faceMesh = circleMesh(gl, 0.95, 100);

        this.markMeshes = [];
        for (let i = 0; i < 60; i++) {
            const radians = (i / 60) * TAU;
            const width = i % 5 === 0 ? 0.02 : 0.01;
            const start = i % 5 === 0 ? 0.8 : 0.85;

            this.markMeshes.push(lineMesh(
                gl,
                Vec2.scaleMut(Vec2.fromAngle(radians), start),
                Vec2.scaleMut(Vec2.fromAngle(radians), 0.9),
                width,
                10,
                true,
            ));
        }

        this.hourHandMesh = lineMesh(
            gl,
            Vec2.scaleMut(Vec2.down(), 0.1),
            Vec2.scaleMut(Vec2.up(), 0.4),
            0.025,
            10,
            true,
        );

        this.minuteHandMesh = lineMesh(
            gl,
            Vec2.scaleMut(Vec2.down(), 0.1),
            Vec2.scaleMut(Vec2.up(), 0.7),
            0.02,
            10,
            true,
        );

        this.secondHandMesh = lineMesh(
            gl,
            Vec2.scaleMut(Vec2.down(), 0.1),
            Vec2.scaleMut(Vec2.up(), 0.9),
            0.01,
            10,
            true,
        );

        this.secondHandTailMesh = lineMesh(
            gl,
            Vec2.scaleMut(Vec2.down(), 0.2),
            Vec2.scaleMut(Vec2.down(), 0.1),
            0.02,
            10,
            true,
        );

        this.handCoverMesh = circleMesh(gl, 0.03, 20);
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
        gl.useProgram(this.shaderProgram.program);

        const MAT4_IDENTITY = new Float32Array(Mat4.identity().data)

        // Border
        draw(gl, this.borderMesh, this.shaderProgram, [], { uColor: COLOR_BLACK, uRotation: MAT4_IDENTITY });
        draw(gl, this.faceMesh, this.shaderProgram, [], { uColor: COLOR_WHITE, uRotation: MAT4_IDENTITY });

        // Marks
        for (const markMesh of this.markMeshes) {
            draw(
                gl,
                markMesh,
                this.shaderProgram,
                [],
                { uColor: COLOR_BLACK, uRotation: MAT4_IDENTITY }
            );
        }

        draw(
            gl,
            this.hourHandMesh,
            this.shaderProgram,
            [],
            { uColor: COLOR_BLACK, uRotation: new Float32Array(Mat4.rotationZ(this.hourHandRadians).data) }
        );

        draw(
            gl,
            this.minuteHandMesh,
            this.shaderProgram,
            [],
            { uColor: COLOR_BLACK, uRotation: new Float32Array(Mat4.rotationZ(this.minuteHandRadians).data) }
        );

        draw(
            gl,
            this.secondHandMesh,
            this.shaderProgram,
            [],
            { uColor: COLOR_ACCENT, uRotation: new Float32Array(Mat4.rotationZ(this.secondHandRadians).data) }
        );

        draw(
            gl,
            this.secondHandTailMesh,
            this.shaderProgram,
            [],
            { uColor: COLOR_ACCENT, uRotation: new Float32Array(Mat4.rotationZ(this.secondHandRadians).data) }
        );

        draw(gl, this.handCoverMesh, this.shaderProgram, [], { uColor: COLOR_BLACK, uRotation: MAT4_IDENTITY });
    }
}