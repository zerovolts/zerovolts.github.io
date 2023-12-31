import { GlApp } from "/shared/gl-app.js"
import { ShaderProgram, Mesh, Texture, Framebuffer } from "/shared/graphics.js";
import { loadImage } from "/shared/util.js";

// Initiate the fetch first to reduce perceived loading.
let shaderSources = Promise.all([
    fetch("./post-processing.vert").then(res => res.text()),
    fetch("./default.frag").then(res => res.text()),
    fetch("./abberation.frag").then(res => res.text()),
    fetch("./gaussian.frag").then(res => res.text()),
    fetch("./sharpen.frag").then(res => res.text()),
    fetch("./edge.frag").then(res => res.text()),
    fetch("./noise.frag").then(res => res.text()),
    fetch("./crt.frag").then(res => res.text()),
    fetch("./tiles.frag").then(res => res.text()),
]);

const buttonIds = [
    "default",
    "abberation",
    "gaussian",
    "sharpen",
    "edge",
    "noise",
    "crt",
    "tiles",
];

let image = loadImage("/assets/images/gallery/pumpkin.png");

document.addEventListener("DOMContentLoaded", async () => {
    shaderSources = await shaderSources;
    image = await image;

    const canvas = document.getElementById("main-canvas");
    const app = new App(canvas);
    app.step();
});

class App extends GlApp {
    setup(gl) {
        gl.clearColor(0.1, 0.1, 0.1, 1.0);
        gl.clearDepth(1.0);

        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        this.vertSrc = shaderSources[0];
        this.fragSrc = shaderSources[1];

        for (let i = 0; i < buttonIds.length; i++) {
            document.getElementById(buttonIds[i]).addEventListener("click", () => {
                this.fragSrc = shaderSources[i + 1];
                this.step();
            });
        }

        this.mesh = new Mesh(gl, {
            position: [-1, -1, 1, -1, 1, 1, -1, 1],
            uv: [0, 0, 1, 0, 1, 1, 0, 1],
            index: [0, 1, 2, 2, 3, 0],
        });

        this.texture = new Texture(gl, image, null, null);
    }

    update(_delta) {}

    render(gl) {
        // We're only re-rendering when the shaders change, otherwise we would
        // not want to do this every render.
        this.shaderProgram = new ShaderProgram(
            gl,
            this.vertSrc,
            this.fragSrc,
            { aPosition: "2f", aUv: "2f" },
            { uTexture: "1i", uDimensions: "2f" },
        );

        this.screen.clear(0, 0, 0, 1);

        this.screen.draw(
            this.mesh,
            this.shaderProgram,
            [this.texture],
            { uDimensions: [this.width, this.height], uTexture: 0 },
        );
    }
}