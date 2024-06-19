import { Mat4 } from "/shared/mat4.js";

export class Scene {
    constructor(camera, entities) {
        this.camera = camera;
        this.entities = entities;
    }

    sortEntities() {
        // TODO: This should be removed once the camera position is fixed.
        const correctedCameraPosition = this.camera.position.scale(-1);

        this.entities.sort((a, b) => {
            const tA = a.shader.supportsTransparency;
            const tB = b.shader.supportsTransparency;

            // Draw transparent objects after opaque ones.
            if (tA && !tB) return 1;
            if (!tA && tB) return -1;

            const camToA = a.transform.translation().sub(correctedCameraPosition);
            const camToB = b.transform.translation().sub(correctedCameraPosition);

            return tA && tB
                // both transparent - sort back to front
                ? camToB.lengthSq() - camToA.lengthSq()
                // both opaque - sort front to back
                : camToA.lengthSq() - camToB.lengthSq();
        });
    }

    render(framebuffer) {
        this.sortEntities();
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