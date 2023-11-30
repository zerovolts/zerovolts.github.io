import { GlApp } from "/shared/gl-app.js"
import { ShaderProgram } from "/shared/graphics.js";

// Initiate the fetch first to reduce perceived loading.
let shaderSources = Promise.all([
    fetch("/pages/template/template.vert").then(res => res.text()),
    fetch("/pages/template/template.frag").then(res => res.text()),
]);

document.addEventListener("DOMContentLoaded", async () => {
    shaderSources = await shaderSources;

    const canvas = document.getElementById("main-canvas");
    const app = new BezierApp(canvas);
    app.step();
});

class BezierApp extends GlApp {
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

        {
            this.triangle = {
                vertexCount: 3,
                positionBuffer: gl.createBuffer(),
                colorBuffer: gl.createBuffer(),
            }

            const positions = new Float32Array([
                this.width / 2, 0,
                this.width, this.height,
                0, this.height,
            ]);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.triangle.positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

            const colors = new Float32Array([
                1, 0, 0, 1,
                0, 1, 0, 1,
                0, 0, 1, 1,
            ]);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.triangle.colorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
        }
    }

    update(_delta) {}

    render(gl) {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(this.shaderProgram.program);

        {
            gl.uniform2fv(this.shaderProgram.uniforms.uDimensions.location, [this.width, this.height]);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.triangle.positionBuffer);
            gl.vertexAttribPointer(this.shaderProgram.attributes.aPosition.location, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(this.shaderProgram.attributes.aPosition.location);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.triangle.colorBuffer);
            gl.vertexAttribPointer(this.shaderProgram.attributes.aColor.location, 4, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(this.shaderProgram.attributes.aColor.location);

            gl.drawArrays(gl.TRIANGLE_FAN, 0, this.triangle.vertexCount);
        }
    }
}