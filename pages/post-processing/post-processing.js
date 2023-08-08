import { GlApp } from "/shared/gl-app.js"
import { createShaderProgram, getAttributeLocations, getUniformLocations } from "/shared/graphics.js";

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

        this.shaderType = "default";
        document.getElementById("default").addEventListener("click", () => {
            this.shaderType = "default";
            this.step();
        });
        document.getElementById("abberation").addEventListener("click", () => {
            this.shaderType = "abberation";
            this.step();
        });
        document.getElementById("gaussian").addEventListener("click", () => {
            this.shaderType = "gaussian";
            this.step();
        });
        document.getElementById("sharpen").addEventListener("click", () => {
            this.shaderType = "sharpen";
            this.step();
        });
        document.getElementById("edge").addEventListener("click", () => {
            this.shaderType = "edge";
            this.step();
        });
        document.getElementById("noise").addEventListener("click", () => {
            this.shaderType = "noise";
            this.step();
        });
        document.getElementById("crt").addEventListener("click", () => {
            this.shaderType = "crt";
            this.step();
        });

        const [vertSrc, defaultFragSrc, abberationFragSrc] = shaderSources;
        this.shaderProgram = createShaderProgram(gl, vertSrc, defaultFragSrc);
        this.attributeLocations = getAttributeLocations(gl, this.shaderProgram, ["aPosition", "aTextureCoord"]);
        this.uniformLocations = getUniformLocations(gl, this.shaderProgram, ["uSampler", "uDimensions"]);

        const positions = new Float32Array([
            -1, -1,
            1, -1,
            1, 1,
            -1, 1
        ]);
        this.imageBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.imageBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        this.textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
        const textureCoords = [
            0, 0,
            1, 0,
            1, 1,
            0, 1,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
    }

    update(_delta) {
    }

    render(gl) {
        const [
            vertSrc,
            defaultFragSrc,
            abberationFragSrc,
            gaussianFragSrc,
            sharpenFragSrc,
            edgeFragSrc,
            noiseFragSrc,
            crtFragSrc,
        ] = shaderSources;

        switch (this.shaderType) {
            case "default":
                this.shaderProgram = createShaderProgram(gl, vertSrc, defaultFragSrc);
                break;
            case "abberation":
                this.shaderProgram = createShaderProgram(gl, vertSrc, abberationFragSrc);
                break;
            case "gaussian":
                this.shaderProgram = createShaderProgram(gl, vertSrc, gaussianFragSrc);
                break;
            case "sharpen":
                this.shaderProgram = createShaderProgram(gl, vertSrc, sharpenFragSrc);
                break;
            case "edge":
                this.shaderProgram = createShaderProgram(gl, vertSrc, edgeFragSrc);
                break;
            case "noise":
                this.shaderProgram = createShaderProgram(gl, vertSrc, noiseFragSrc);
                break;
            case "crt":
                this.shaderProgram = createShaderProgram(gl, vertSrc, crtFragSrc);
                break;
        }
        this.attributeLocations = getAttributeLocations(gl, this.shaderProgram, ["aPosition", "aTextureCoord"]);
        this.uniformLocations = getUniformLocations(gl, this.shaderProgram, ["uSampler", "uDimensions"]);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(this.shaderProgram);

        gl.uniform1i(this.uniformLocations.uSampler, 0);
        gl.uniform2fv(this.uniformLocations.uDimensions, [this.width, this.height]);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
        gl.vertexAttribPointer(this.attributeLocations.aTextureCoord, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.attributeLocations.aTextureCoord);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.imageBuffer);
        gl.vertexAttribPointer(this.attributeLocations.aPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.attributeLocations.aPosition);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    }
}