import { GlApp } from "/shared/gl-app.js"
import { Mat4 } from "/shared/mat4.js"
import { ShaderProgram, Mesh, draw } from "/shared/graphics.js";

// Initiate the fetch first to reduce perceived loading.
let shaderSources = Promise.all([
    fetch("/pages/cube/cube.vert").then(res => res.text()),
    fetch("/pages/cube/cube.frag").then(res => res.text()),
]);

document.addEventListener("DOMContentLoaded", async () => {
    shaderSources = await shaderSources;

    const canvas = document.getElementById("main-canvas");
    const app = new App(canvas);
    app.run();
});

class App extends GlApp {
    setup(gl) {
        gl.clearColor(0.1, 0.1, 0.1, 1.0);

        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);

        const [vertexSource, fragmentSource] = shaderSources;
        this.shaderProgram = new ShaderProgram(
            gl,
            vertexSource,
            fragmentSource,
            { aPosition: "3f", aColor: "4f", aUv: "2f", aNormal: "3f" },
            { uDimensions: "2f", uTransform: "m4f" },
        );

        this.t = 0;

        const a = -.5;
        const z = .5;
        this.cubeMesh = new Mesh(gl, {
            position: [
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
            index: [
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
            uv: [
                1, 0, 0, 0, 0, 1, 1, 1,
                1, 0, 0, 0, 0, 1, 1, 1,
                1, 0, 0, 0, 0, 1, 1, 1,
                1, 0, 0, 0, 0, 1, 1, 1,
                1, 0, 0, 0, 0, 1, 1, 1,
                1, 0, 0, 0, 0, 1, 1, 1,
            ],
            normal: [
                0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
                0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
                0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
                0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
                -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
                1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
            ],
            color: [
                // Front
                1, 0, 0, 1,
                1, 0, 0, 1,
                1, 0, 0, 1,
                1, 0, 0, 1,
                // Back
                0, 1, 1, 1,
                0, 1, 1, 1,
                0, 1, 1, 1,
                0, 1, 1, 1,
                // Top
                0, 0, 1, 1,
                0, 0, 1, 1,
                0, 0, 1, 1,
                0, 0, 1, 1,
                // Bottom
                1, 1, 0, 1,
                1, 1, 0, 1,
                1, 1, 0, 1,
                1, 1, 0, 1,
                // Left
                0, 1, 0, 1,
                0, 1, 0, 1,
                0, 1, 0, 1,
                0, 1, 0, 1,
                // Right
                1, 0, 1, 1,
                1, 0, 1, 1,
                1, 0, 1, 1,
                1, 0, 1, 1,
            ],
        });
    }

    update(delta) {
        this.t += delta;
    }

    render(gl) {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(this.shaderProgram.program);

        const model = Mat4.scalar(.5, .5, .5)
            .rotate(Math.PI / 4, this.t, this.t)
            .translate(0, 0, -2)
            .project(.8, 1, .1, 100);

        draw(
            gl,
            this.cubeMesh,
            this.shaderProgram,
            [],
            { uDimensions: [this.width, this.height], uTransform: model.data }
        );
    }
}