import { Mat4 } from "/shared/mat4.js";

export class Scene {
    constructor(camera, entities) {
        this.camera = camera;
        this.entities = entities;
    }

    render(framebuffer) {
        for (const entity of this.entities) {
            entity.draw(framebuffer, this.camera);
        }
    }
}

export class Entity {
    constructor(transform, mesh, shader) {
        this.transform = transform;
        this.mesh = mesh;
        this.shader = shader;
    }

    draw(framebuffer, camera) {
        framebuffer.draw(this.mesh, this.shader, [], {
            uMvp: this.transform.mul(camera.viewMatrix()).mul(camera.projectionMatrix()).data,
            uModel: this.transform.data,
            uCameraPosition: camera.position.data,
        });
    }
}

export class Camera {
    constructor(position, forward, up, fov, aspect, near, far) {
        this.position = position;
        this.forward = forward;
        this.up = up;

        this.fov = fov;
        this.aspect = aspect;
        this.near = near;
        this.far = far;
    }

    viewMatrix() {
        const fixedPos = this.position.copy();
        fixedPos.x *= -1;
        const right = this.forward.cross(this.up).normalize();
        const direction = Mat4.fromBasisVectors(right, this.up, this.forward.scale(-1));
        return Mat4.translation(...fixedPos.data).mul(direction);
    }

    projectionMatrix() {
        return Mat4.projection(this.fov, this.aspect, this.near, this.far);
    }
}