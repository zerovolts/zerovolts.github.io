import { GlApp } from "/shared/gl-app.js"
import { Mat4 } from "/shared/mat4.js"
import { ShaderProgram } from "/shared/graphics.js";
import { icosahedronMesh } from "/shared/geometry.js";

// Initiate the fetch first to reduce perceived loading.
let shaderSources = Promise.all([
    fetch("./phong.vert").then(res => res.text()),
    fetch("./phong.frag").then(res => res.text()),
]);

document.addEventListener("DOMContentLoaded", async () => {
    shaderSources = await shaderSources;

    const canvas = document.getElementById("main-canvas");
    const app = new App(canvas);
    app.run();
});

const AMBIENT_FLAG = 1;
const DIFFUSE_FLAG = 2;
const SPECULAR_FLAG = 4;

class App extends GlApp {
    setup(gl) {
        this.lightFlags = AMBIENT_FLAG | DIFFUSE_FLAG | SPECULAR_FLAG;

        const ambientButton = document.getElementById("ambient");
        const diffuseButton = document.getElementById("diffuse");
        const specularButton = document.getElementById("specular");
        ambientButton.addEventListener("click", () => {
            this.lightFlags ^= AMBIENT_FLAG;
            ambientButton.classList.toggle("positive");
            ambientButton.classList.toggle("negative");
        });
        diffuseButton.addEventListener("click", () => {
            this.lightFlags ^= DIFFUSE_FLAG;
            diffuseButton.classList.toggle("positive");
            diffuseButton.classList.toggle("negative");
        });
        specularButton.addEventListener("click", () => {
            this.lightFlags ^= SPECULAR_FLAG;
            specularButton.classList.toggle("positive");
            specularButton.classList.toggle("negative");
        });

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
            { aPosition: "3f", aUv: "2f", aNormal: "3f" },
            { uTransform: "m4f", uLightFlags: "1i" },
        );

        this.t = 0;

        this.icosahedronMesh = icosahedronMesh(gl);
    }

    update(delta) {
        this.t += delta;
    }

    render(gl) {
        const model = Mat4.scalar(.5, .5, .5)
            .rotateX(Math.PI / 4)
            .rotateY(this.t / 2)
            .rotateZ(this.t / 2)
            .translate(0, 0, -2)
            .project(.8, 1, .1, 100);

        this.screen.clear(0, 0, 0, 0);

        this.screen.draw(
            this.icosahedronMesh,
            this.shaderProgram,
            [],
            { uTransform: model.data, uLightFlags: this.lightFlags },
        );
    }
}