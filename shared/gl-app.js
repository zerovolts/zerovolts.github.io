import { Framebuffer } from "./graphics.js"

export class GlApp {
    /** @param {HTMLCanvasElement} canvas */
    constructor(canvas) {
        // Fix resolution on high pixel density displays.
        canvas.width = Math.floor(canvas.clientWidth * window.devicePixelRatio);
        canvas.height = Math.floor(canvas.clientHeight * window.devicePixelRatio);

        /** @type {WebGL2RenderingContext} */
        this.gl = canvas.getContext("webgl2", { antialias: true });
        if (this.gl === null) throw new Error("WebGL2 not supported");

        this.width = canvas.width;
        this.height = canvas.height;
        this.running = true;
        this.prevTimestamp = 0;

        this.screen = new Framebuffer(this.gl, null, this.width, this.height);

        this.setup(this.gl);

        this._run = this._run.bind(this);
        this.step = this.step.bind(this);
    }

    step(delta) {
        this.update(delta ?? 0);
        this.render(this.gl);
    }

    run() {
        this.start = performance.now();
        this.prevTimestamp = this.start;
        window.requestAnimationFrame(this._run);
    }

    _run(timestamp) {
        const delta = (timestamp - this.prevTimestamp) / 1000;
        this.prevTimestamp = timestamp;
        this.step(delta);
        if (this.running) {
            window.requestAnimationFrame(this._run);
        }
    }

    /** @param {WebGL2RenderingContext} gl */
    setup(gl) {
        // Override in subclass
    }

    update(delta) {
        // Override in subclass
    }

    /** @param {WebGL2RenderingContext} gl */
    render(gl) {
        // Override in subclass
    }
}
