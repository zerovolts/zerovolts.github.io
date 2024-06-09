import { quadMesh2d } from "/shared/geometry.js";
import { GlApp } from "/shared/gl-app.js"
import { ShaderProgram, Texture, Framebuffer } from "/shared/graphics.js";

// Initiate the fetch first to reduce perceived loading.
let shaderSources = Promise.all([
    fetch("./default.vert").then(res => res.text()),
    fetch("./default.frag").then(res => res.text()),
    fetch("./reset.frag").then(res => res.text()),
    fetch("./life.frag").then(res => res.text()),
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

        const resetButton = document.getElementById("reset");
        resetButton.addEventListener("click", () => {
            this.needsReset = true;
            this.stepCount = 0;
        })
        const toggleButton = document.getElementById("toggle");
        toggleButton.addEventListener("click", () => {
            this.paused = !this.paused;
            toggleButton.innerText = this.paused ? "Start" : "Stop";
        })
        this.stepCounter = document.getElementById("step-count");

        this.defaultShader = new ShaderProgram(
            gl,
            shaderSources[0],
            shaderSources[1],
            { aPosition: "2f", aUv: "2f" },
            { board: "1i" },
        );
        this.resetShader = new ShaderProgram(
            gl,
            shaderSources[0],
            shaderSources[2],
            { aPosition: "2f", aUv: "2f" },
            { uTime: "1f" },
        );
        this.lifeSimShader = new ShaderProgram(
            gl,
            shaderSources[0],
            shaderSources[3],
            { aPosition: "2f", aUv: "2f" },
            { uResolution: "2f", board: "1i" },
        );

        this.stepCount = 0;

        this.quadMesh = quadMesh2d(gl);

        this.tempBoardTexture = new Texture(gl, null, this.width, this.height);
        this.tempBoardFramebuffer = Framebuffer.fromTexture(gl, this.tempBoardTexture);

        this.boardTexture = new Texture(gl, null, this.width, this.height);
        this.boardFramebuffer = Framebuffer.fromTexture(gl, this.boardTexture);

        this.needsReset = true;
        this.paused = false;
    }

    update(_delta) {
        if (!this.paused) {
            this.stepCount += 1;
        }
        this.stepCounter.innerText = this.stepCount;
    }

    render(gl) {
        if (this.needsReset) {
            this.boardFramebuffer.clear(0, 0, 0, 0);
            this.boardFramebuffer.draw(this.quadMesh, this.resetShader, [], { uTime: this.prevTimestamp });
            this.needsReset = false;

            this.screen.draw(
                this.quadMesh,
                this.defaultShader,
                [this.boardTexture],
                { board: 0 }
            );
        }

        if (!this.paused) {
            this.tempBoardFramebuffer.draw(
                this.quadMesh,
                this.defaultShader,
                [this.boardTexture],
                { board: 0 }
            );
            this.boardFramebuffer.draw(
                this.quadMesh,
                this.lifeSimShader,
                [this.tempBoardTexture],
                { uResolution: [this.width, this.height], board: 0 }
            );
            this.screen.draw(
                this.quadMesh,
                this.defaultShader,
                [this.boardTexture],
                { board: 0 }
            );
        }
    }
}