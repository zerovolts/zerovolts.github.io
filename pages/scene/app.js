import { GlApp } from "/shared/gl-app.js"
import { ShaderProgram, Mesh } from "/shared/graphics.js";
import { quadMesh, icosahedronMesh } from "/shared/geometry.js";
import { Vec3 } from "/shared/vec3.js";
import { Mat4 } from "/shared/mat4.js";
import { Scene, Camera, Entity } from "/shared/scene.js";
import { repeat } from "/shared/util.js";

// Initiate the fetch first to reduce perceived loading.
let shaderSources = Promise.all([
    fetch("./default.vert").then(res => res.text()),
    fetch("./default.frag").then(res => res.text()),
    fetch("./phong.vert").then(res => res.text()),
    fetch("./phong.frag").then(res => res.text()),
]);

document.addEventListener("DOMContentLoaded", async () => {
    shaderSources = await shaderSources;

    const canvas = document.getElementById("main-canvas");
    const app = new App(canvas);
    app.run();
});

class App extends GlApp {
    setup(gl) {
        this.handleKeydown.bind(this);

        this.t = 0;

        this.keys = {
            "up": false,
            "down": false,
            "left": false,
            "right": false,
            "q": false,
            "e": false,
        };

        gl.enable(gl.DEPTH_TEST);

        this.colorShaderProgram = new ShaderProgram(
            gl,
            shaderSources[0],
            shaderSources[1],
            { aPosition: "3f", aColor: "4f" },
            { uMvp: "m4f", uModel: "m4f", uCameraPosition: "3f" },
        );

        this.lightingShaderProgram = new ShaderProgram(
            gl,
            shaderSources[2],
            shaderSources[3],
            { aPosition: "3f", aColor: "4f", aNormal: "3f", aUv: "2f" },
            { uMvp: "m4f", uModel: "m4f", uCameraPosition: "3f" },
        );

        this.cube = new Entity(
            Mat4.identity().translate(0, 2, 6),
            icosahedronMesh(gl),
            this.lightingShaderProgram,
        );
        this.cube.mesh.setAttribute("aColor", repeat(60, [0.17, 1.00, 0.36, 1]));

        this.floor = new Entity(
            Mat4.identity().rotateX(Math.PI / 2).scale(8, 1, 8),
            quadMesh(gl),
            this.lightingShaderProgram,
        );
        this.floor.mesh.setAttribute("aColor", repeat(4, [0.05, 0.07, 0.19, 1]));

        this.gridMesh = new Mesh(gl, {
            aPosition: [
                100, 0, 0,
                -100, 0, 0,
                0, 100, 0,
                0, -100, 0,
                0, 0, 100,
                0, 0, -100,
            ],
            aNormal: [
                1, 0, 0,
                1, 0, 0,
                1, 0, 0,
                1, 0, 0,
                1, 0, 0,
                1, 0, 0,
            ],
            aColor: [
                1, 0, 0, .1,
                1, 0, 0, .1,
                0, 1, 0, .1,
                0, 1, 0, .1,
                0, 0, 1, .1,
                0, 0, 1, .1,
            ],
            indexBuffer: [0, 1, 2, 3, 4, 5],
        })
        this.gridMesh.renderMode = gl.LINES;
        this.grid = new Entity(
            Mat4.identity(),
            this.gridMesh,
            this.colorShaderProgram,
        );

        this.camera = new Camera(Vec3.back().add(Vec3.down().scale(2)), Vec3.back(), Vec3.up(), .8, 1, .1, 100);

        this.scene = new Scene(this.camera, [this.floor, this.cube, this.grid]);

        document.addEventListener("keydown", (e) => this.handleKeydown(e));
        document.addEventListener("keyup", (e) => this.handleKeyup(e));
    }

    update(delta) {
        this.t += delta;
        if (this.keys.up) {
            this.camera.position.addMut(this.camera.forward.scale(-0.1));
        }
        if (this.keys.down) {
            this.camera.position.addMut(this.camera.forward.scale(0.1));
        }
        if (this.keys.left) {
            this.camera.forward = Mat4.rotationY(-.01).mulVec(this.camera.forward).normalize();
        }
        if (this.keys.right) {
            this.camera.forward = Mat4.rotationY(.01).mulVec(this.camera.forward).normalize();
        }
        if (this.keys.q) {
            const right = this.camera.forward.cross(this.camera.up);
            this.camera.position.addMut(right.scale(-0.1));
        }
        if (this.keys.e) {
            const right = this.camera.forward.cross(this.camera.up);
            this.camera.position.addMut(right.scale(0.1));
        }

        this.cube.transform = Mat4.identity()
            .rotateX(Math.PI / 4)
            .rotateY(this.t / 2)
            .rotateZ(this.t / 2)
            .translate(0, 2, 6);
    }

    render(gl) {
        this.screen.clear(0.53, 0.85, 1.00, 1.);
        this.scene.render(this.screen);
    }

    handleKeydown(e) {
        switch (e.key) {
            case "w": {
                this.keys.up = true;
            } break;
            case "s": {
                this.keys.down = true;
            } break;
            case "a": {
                this.keys.left = true;
            } break;
            case "d": {
                this.keys.right = true;
            } break;
            case "q": {
                this.keys.q = true;
            } break;
            case "e": {
                this.keys.e = true;
            } break;
        }
    }

    handleKeyup(e) {
        switch (e.key) {
            case "w": {
                this.keys.up = false;
            } break;
            case "s": {
                this.keys.down = false;
            } break;
            case "a": {
                this.keys.left = false;
            } break;
            case "d": {
                this.keys.right = false;
            } break;
            case "q": {
                this.keys.q = false;
            } break;
            case "e": {
                this.keys.e = false;
            } break;
        }
    }
}