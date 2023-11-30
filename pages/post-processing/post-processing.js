import { GlApp } from "/shared/gl-app.js"
import { ShaderProgram, Mesh, Texture, draw } from "/shared/graphics.js";

// Initiate the fetch first to reduce perceived loading.
let shaderSources = Promise.all([
    fetch("/pages/post-processing/post-processing.vert").then(res => res.text()),
    fetch("/pages/post-processing/default.frag").then(res => res.text()),
    fetch("/pages/post-processing/abberation.frag").then(res => res.text()),
    fetch("/pages/post-processing/gaussian.frag").then(res => res.text()),
    fetch("/pages/post-processing/sharpen.frag").then(res => res.text()),
    fetch("/pages/post-processing/edge.frag").then(res => res.text()),
    fetch("/pages/post-processing/noise.frag").then(res => res.text()),
    fetch("/pages/post-processing/crt.frag").then(res => res.text()),
    fetch("/pages/post-processing/tiles.frag").then(res => res.text()),
]);

const image = new Image();

document.addEventListener("DOMContentLoaded", async () => {
    shaderSources = await shaderSources;

    const canvas = document.getElementById("main-canvas");

    image.addEventListener("load", () => {
        const app = new BezierApp(canvas);
        app.step();
    });
    image.src = "/assets/images/gallery/pumpkin.png";
});

class BezierApp extends GlApp {
    setup(gl) {
        gl.clearColor(0.1, 0.1, 0.1, 1.0);
        gl.clearDepth(1.0);

        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        const [
            defaultVertSrc,
            defaultFragSrc,
            abberationFragSrc,
            gaussianFragSrc,
            sharpenFragSrc,
            edgeFragSrc,
            noiseFragSrc,
            crtFragSrc,
            tilesFragSrc,
        ] = shaderSources;

        this.vertSrc = defaultVertSrc;
        this.fragSrc = defaultFragSrc;

        document.getElementById("default").addEventListener("click", () => {
            this.fragSrc = defaultFragSrc;
            this.step();
        });
        document.getElementById("abberation").addEventListener("click", () => {
            this.fragSrc = abberationFragSrc;
            this.step();
        });
        document.getElementById("gaussian").addEventListener("click", () => {
            this.fragSrc = gaussianFragSrc;
            this.step();
        });
        document.getElementById("sharpen").addEventListener("click", () => {
            this.fragSrc = sharpenFragSrc;
            this.step();
        });
        document.getElementById("edge").addEventListener("click", () => {
            this.fragSrc = edgeFragSrc;
            this.step();
        });
        document.getElementById("noise").addEventListener("click", () => {
            this.fragSrc = noiseFragSrc;
            this.step();
        });
        document.getElementById("crt").addEventListener("click", () => {
            this.fragSrc = crtFragSrc;
            this.step();
        });
        document.getElementById("tiles").addEventListener("click", () => {
            this.fragSrc = tilesFragSrc;
            this.step();
        });

        this.mesh = new Mesh(
            gl,
            [-1, -1, 1, -1, 1, 1, -1, 1],
            [0, 0, 1, 0, 1, 1, 0, 1],
            [0, 1, 2, 2, 3, 0],
        );

        this.texture = new Texture(gl, image);
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
            { uSampler: "1i", uDimensions: "2f" },
        );

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        draw(
            gl,
            this.mesh,
            this.shaderProgram,
            [this.texture],
            { uDimensions: [this.width, this.height], uSampler: 0 }
        );
    }
}