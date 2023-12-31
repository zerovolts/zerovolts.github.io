import { GlApp } from "/shared/gl-app.js"
import { ShaderProgram, Mesh, Framebuffer } from "/shared/graphics.js";

// Initiate the fetch first to reduce perceived loading.
let shaderSources = Promise.all([
    fetch("./default.vert").then(res => res.text()),
    fetch("./default.frag").then(res => res.text()),
]);

document.addEventListener("DOMContentLoaded", async () => {
    shaderSources = await shaderSources;

    const canvas = document.getElementById("main-canvas");
    const app = new App(canvas);
    app.step();
});

class App extends GlApp {
    setup(gl) {
        gl.clearColor(0.1, 0.1, 0.1, 1.0);

        const [vertexSource, fragmentSource] = shaderSources;
        this.shaderProgram = new ShaderProgram(
            gl,
            vertexSource,
            fragmentSource,
            { aPosition: "2f", aColor: "4f" },
            {},
        );

        this.triangleMesh = new Mesh(gl, {
            position: [
                0, 1,
                -1, -1,
                1, -1,
            ],
            color: [
                1, 0, 0, 1,
                0, 1, 0, 1,
                0, 0, 1, 1,
            ],
            index: [0, 1, 2],
        });
    }

    update(_delta) {}

    render(gl) {
        this.screen.clear(0, 0, 0, 0);
        this.screen.draw(this.triangleMesh, this.shaderProgram, [], {});
    }
}