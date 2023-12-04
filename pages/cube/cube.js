import { GlApp } from "/shared/gl-app.js"
import { Mat4 } from "/shared/mat4.js"
import { ShaderProgram } from "/shared/graphics.js";

// Initiate the fetch first to reduce perceived loading.
let shaderSources = Promise.all([
    fetch("/pages/cube/cube.vert").then(res => res.text()),
    fetch("/pages/cube/cube.frag").then(res => res.text()),
]);

document.addEventListener("DOMContentLoaded", async () => {
    shaderSources = await shaderSources;

    const canvas = document.getElementById("main-canvas");
    const app = new BezierApp(canvas);
    app.run();
});

class BezierApp extends GlApp {
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
            { "aPosition": "3f", "aColor": "4f", "aUv": "2f", "aNormal": "3f" },
            { "uDimensions": "2f", "uTransform": "m4f" },
        );

        this.t = 0;

        {
            this.cube = {
                vertexCount: 0,
                indexCount: 0,
                positionBuffer: gl.createBuffer(),
                indexBuffer: gl.createBuffer(),
                colorBuffer: gl.createBuffer(),
                uvBuffer: gl.createBuffer(),
                normalBuffer: gl.createBuffer(),
            };
            const a = -.5;
            const z = .5;
            const positions = new Float32Array([
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
            ]);
            this.cube.vertexCount = positions.length / 3;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.cube.positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

            const indices = new Uint16Array([
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
            ]);
            this.cube.indexCount = indices.length;
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cube.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

            const colors = new Float32Array([
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
            gl.bindBuffer(gl.ARRAY_BUFFER, this.cube.colorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

            const uvs = new Float32Array([
                1, 0, 0, 0, 0, 1, 1, 1,
                1, 0, 0, 0, 0, 1, 1, 1,
                1, 0, 0, 0, 0, 1, 1, 1,
                1, 0, 0, 0, 0, 1, 1, 1,
                1, 0, 0, 0, 0, 1, 1, 1,
                1, 0, 0, 0, 0, 1, 1, 1,
            ]);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.cube.uvBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);


            const normals = new Float32Array([
                0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
                0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
                0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
                0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
                -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
                1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
            ]);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.cube.normalBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
        }
    }

    update(delta) {
        this.t += delta;
    }

    render(gl) {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(this.shaderProgram.program);

        const model = Mat4.scalar(.5, .5, .5).rotate(Math.PI / 4, this.t, this.t);

        {
            gl.uniform2fv(this.shaderProgram.uniforms.uDimensions.location, [this.width, this.height]);
            gl.uniformMatrix4fv(this.shaderProgram.uniforms.uTransform.location, false, model.data);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.cube.positionBuffer);
            gl.vertexAttribPointer(this.shaderProgram.attributes.aPosition.location, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(this.shaderProgram.attributes.aPosition.location);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.cube.colorBuffer);
            gl.vertexAttribPointer(this.shaderProgram.attributes.aColor.location, 4, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(this.shaderProgram.attributes.aColor.location);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.cube.uvBuffer);
            gl.vertexAttribPointer(this.shaderProgram.attributes.aUv.location, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(this.shaderProgram.attributes.aUv.location);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.cube.normalBuffer);
            gl.vertexAttribPointer(this.shaderProgram.attributes.aNormal.location, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(this.shaderProgram.attributes.aNormal.location);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cube.indexBuffer);

            gl.drawElements(gl.TRIANGLES, this.cube.indexCount, gl.UNSIGNED_SHORT, 0);
        }
    }
}