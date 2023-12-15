import { GlApp } from "/shared/gl-app.js"
import { ShaderProgram, Mesh, draw } from "/shared/graphics.js";

// Initiate the fetch first to reduce perceived loading.
let shaderSources = Promise.all([
    fetch("/pages/template/template.vert").then(res => res.text()),
    fetch("/pages/template/template.frag").then(res => res.text()),
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
            { uDimensions: "2f" },
        );

        this.triangleMesh = new Mesh(gl, {
            position: [
                this.width / 2, 0,
                this.width, this.height,
                0, this.height,
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
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        draw(gl, this.triangleMesh, this.shaderProgram, [], { uDimensions: [this.width, this.height] });
    }
}