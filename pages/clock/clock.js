import { TAU } from "/shared/math.js"
import { GlApp } from "/shared/gl-app.js"
import { circleMesh, lineMesh } from "/shared/geometry.js";
import { ShaderProgram, Framebuffer } from "/shared/graphics.js";
import { Vec2 } from "/shared/vec2.js";
import { Mat4 } from "/shared/mat4.js";

const COLOR_WHITE = [1.0, 1.0, 1.0, 1.0];
const COLOR_BLACK = [0.17, 0.24, 0.31, 1.0];
const COLOR_ACCENT = [1.0, 0.42, 0.31, 1.0];

// Initiate the fetch first to reduce perceived loading.
let shaderSources = Promise.all([
    fetch("./hand.vert").then(res => res.text()),
    fetch("./flat_color.frag").then(res => res.text()),
]);

document.addEventListener("DOMContentLoaded", async () => {
    shaderSources = await shaderSources;

    const canvas = document.getElementById("main-canvas");
    const app = new App(canvas);
    app.run();
});

class App extends GlApp {
    setup(gl) {
        gl.clearDepth(1.0);

        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        const [vertexSource, fragmentSource] = shaderSources;
        this.shaderProgram = new ShaderProgram(
            gl,
            vertexSource,
            fragmentSource,
            { aPosition: "2f" },
            { uColor: "4f", uTransform: "m4f" },
        );

        this.shouldRender = true;

        this.borderMesh = circleMesh(gl, 1, 100);
        this.faceMesh = circleMesh(gl, .95, 100);

        this.markMesh = lineMesh(
            gl,
            Vec2.up().scaleMut(.85),
            Vec2.up().scaleMut(.9),
            .01,
            10,
            true,
        );

        this.fiveMarkMesh = lineMesh(
            gl,
            Vec2.up().scaleMut(.8),
            Vec2.up().scaleMut(.9),
            .02,
            10,
            true,
        );

        this.hourHandMesh = lineMesh(
            gl,
            Vec2.down().scaleMut(.1),
            Vec2.up().scaleMut(.4),
            .025,
            10,
            true,
        );

        this.minuteHandMesh = lineMesh(
            gl,
            Vec2.down().scaleMut(.1),
            Vec2.up().scaleMut(.7),
            .02,
            10,
            true,
        );

        this.secondHandMesh = lineMesh(
            gl,
            Vec2.down().scaleMut(.1),
            Vec2.up().scaleMut(.9),
            .01,
            10,
            true,
        );

        this.secondHandTailMesh = lineMesh(
            gl,
            Vec2.down().scaleMut(.2),
            Vec2.down().scaleMut(.1),
            .02,
            10,
            true,
        );

        this.handCoverMesh = circleMesh(gl, .03, 20);
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

        const MAT4_IDENTITY = new Float32Array(Mat4.identity().data)

        this.screen.clear(0, 0, 0, 0);

        this.screen.draw(
            this.borderMesh,
            this.shaderProgram,
            [],
            { uColor: COLOR_BLACK, uTransform: MAT4_IDENTITY },
        );
        this.screen.draw(
            this.faceMesh,
            this.shaderProgram,
            [],
            { uColor: COLOR_WHITE, uTransform: MAT4_IDENTITY },
        );

        for (let i = 0; i < 60; i++) {
            const angle = (i / 60) * TAU;

            if (i % 5 === 0) {
                this.screen.draw(
                    this.fiveMarkMesh,
                    this.shaderProgram,
                    [],
                    { uColor: COLOR_BLACK, uTransform: Mat4.rotationZ(angle).data },
                );
            } else {
                this.screen.draw(
                    this.markMesh,
                    this.shaderProgram,
                    [],
                    { uColor: COLOR_BLACK, uTransform: Mat4.rotationZ(angle).data },
                );
            }
        }

        this.screen.draw(
            this.hourHandMesh,
            this.shaderProgram,
            [],
            { uColor: COLOR_BLACK, uTransform: new Float32Array(Mat4.rotationZ(this.hourHandRadians).data) },
        );

        this.screen.draw(
            this.minuteHandMesh,
            this.shaderProgram,
            [],
            { uColor: COLOR_BLACK, uTransform: new Float32Array(Mat4.rotationZ(this.minuteHandRadians).data) },
        );

        this.screen.draw(
            this.secondHandMesh,
            this.shaderProgram,
            [],
            { uColor: COLOR_ACCENT, uTransform: new Float32Array(Mat4.rotationZ(this.secondHandRadians).data) },
        );

        this.screen.draw(
            this.secondHandTailMesh,
            this.shaderProgram,
            [],
            { uColor: COLOR_ACCENT, uTransform: new Float32Array(Mat4.rotationZ(this.secondHandRadians).data) },
        );

        this.screen.draw(
            this.handCoverMesh,
            this.shaderProgram,
            [],
            { uColor: COLOR_BLACK, uTransform: MAT4_IDENTITY },
        );
    }
}