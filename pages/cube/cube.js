import { GlApp } from "/shared/gl-app.js"
import { Mat4 } from "/shared/mat4.js"
import { ShaderProgram, draw } from "/shared/graphics.js";
import { cubeMesh } from "/shared/geometry.js";

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

        this.cubeMesh = cubeMesh(gl);

        this.cubeMesh.setAttribute("aColor", [
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
        ]);
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