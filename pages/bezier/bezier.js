import { GlApp } from "../../shared/gl-app.js"
import { ShaderProgram } from "/shared/graphics.js";
import { Vec2 } from "/shared/vec2.js";

// Initiate the fetch first to reduce perceived loading.
let shaderSources = Promise.all([
    fetch("/pages/bezier/bezier.vert").then(res => res.text()),
    fetch("/pages/bezier/bezier.frag").then(res => res.text()),
]);

document.addEventListener("DOMContentLoaded", async () => {
    shaderSources = await shaderSources;

    const canvas = document.getElementById("main-canvas");
    const app = new App(canvas);
    app.step();

    const button = document.getElementById("generate");
    button.onclick = app.step;
});

class App extends GlApp {
    setup(gl) {
        gl.clearColor(0.1, 0.1, 0.1, 1.0);
        gl.clearDepth(1.0);

        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        const [vertexSource, fragmentSource] = shaderSources;
        this.shaderProgram = new ShaderProgram(
            gl,
            vertexSource,
            fragmentSource,
            { position: "2f" },
            { dimensions: "2f" }
        );
    }

    update(_delta) {
        this.paths = [];
        for (let i = 0; i < 8; i++) {
            const extreme = this.width / 2;
            const from = Vec2.randomRange(-extreme, extreme);
            const fromCtrl = Vec2.randomRange(-extreme, extreme);
            const toCtrl = Vec2.randomRange(-extreme, extreme);
            const to = Vec2.randomRange(-extreme, extreme);

            const segments = 32;
            const path = [];
            for (let i = 0; i < segments; i++) {
                path.push(
                    from.cubicLerp(fromCtrl, toCtrl, to, i / segments)
                        .extend(Math.sin(((i / (segments - 1)) - 1) * Math.PI))
                );
            }

            this.paths.push(path);
        }
    }

    render(gl) {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(this.shaderProgram.program);
        gl.uniform2fv(this.shaderProgram.uniforms.dimensions.location, [this.width, this.height]);

        for (const path of this.paths) {
            const positions = new Float32Array(extrudeLine(path, 4).map(x => x.data).flat());

            const positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

            gl.vertexAttribPointer(this.shaderProgram.attributes.position.location, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(this.shaderProgram.attributes.position.location);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, positions.length / 3);
        }
    }
}

/**
 * Expects a list of 3d vectors, but mostly ignores the z component.
 */
function extrudeLine(points, width) {
    const pointAngles = [points[0].truncate().angleTo(points[0].truncate())];
    // Iterate over all but the first and last.
    for (let i = 1; i < points.length - 1; i++) {
        const before = points[i - 1];
        const position = points[i];
        const after = points[i + 1];

        const beforeAngle = before.truncate().angleTo(position.truncate());
        const afterAngle = position.truncate().angleTo(after.truncate());

        const angleDiff = afterAngle - beforeAngle;
        const flipped = angleDiff <= -Math.PI || angleDiff >= Math.PI

        if (flipped) {
            const largerAngle = Math.max(beforeAngle, afterAngle);
            const smallerAngle = Math.min(beforeAngle, afterAngle) + (Math.PI * 2);
            pointAngles.push((largerAngle + smallerAngle) / 2);
        } else {
            pointAngles.push((beforeAngle + afterAngle) / 2);
        }
    }
    pointAngles.push(points.at(-2).truncate().angleTo(points.at(-1).truncate()));

    const extrudedPoints = [];
    for (let i = 0; i < points.length; i++) {
        const point = points[i];
        const angle = pointAngles[i];

        const leftOffset = Vec2.fromAngle(angle + (Math.PI / 2)).scaleMut(width / 2).extend(0);
        const rightOffset = leftOffset.scale(-1);

        const leftPoint = point.add(leftOffset);
        const rightPoint = point.add(rightOffset);

        extrudedPoints.push(leftPoint);
        extrudedPoints.push(rightPoint);
    }

    return extrudedPoints;
};