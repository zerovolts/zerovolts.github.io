import { GlApp } from "/shared/gl-app.js"
import { createShaderProgram, getAttributeLocations, getUniformLocations } from "/shared/graphics.js";

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
        this.shaderProgram = createShaderProgram(gl, vertexSource, fragmentSource);
        this.attributeLocations = getAttributeLocations(gl, this.shaderProgram, ["aPosition", "aColor"]);
        this.uniformLocations = getUniformLocations(gl, this.shaderProgram, ["uDimensions"]);

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
        gl.useProgram(this.shaderProgram);

        {
            gl.uniform2fv(this.uniformLocations.uDimensions, [this.width, this.height]);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.triangle.positionBuffer);
            gl.vertexAttribPointer(this.attributeLocations.aPosition, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(this.attributeLocations.aPosition);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.triangle.colorBuffer);
            gl.vertexAttribPointer(this.attributeLocations.aColor, 4, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(this.attributeLocations.aColor);

            gl.drawArrays(gl.TRIANGLE_FAN, 0, this.triangle.vertexCount);
        }
    }
}