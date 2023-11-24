// Goals
// - Separate mesh and material so they can be interchanged easily
// - Reduce the need for custom WebGL when creating new objects
// Uniforms
// - Global - time, resolution
// - Per material - color
// - Per instance - transform
export class Renderer {
    constructor(gl, uniforms) {
        this.gl = gl;
        this.uniforms = uniforms;
    }

    createMesh(positions, uvs, indices) {
        const gl = this.gl;

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        const uvBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

        return {
            positionBuffer,
            uvBuffer,
            indexBuffer,
        };
    }

    // TODO: iterate on shader/material abstraction boundary
    createMaterial(shaderProgram, uniforms) {
        const gl = this.gl;

        return {
            shaderProgram,
            uniforms,
        };
    }

    draw(mesh, material, uniforms) {
        const gl = this.gl;

        gl.useProgram(material.shaderProgram.program);

        for (const [key, value] of Object.entries(uniforms)) {
            const location = material.shaderProgram.uniformLocations[key];
            this.setUniform(location, value);
        }
        for (const [key, value] of Object.entries(material.uniforms)) {
            const location = material.shaderProgram.uniformLocations[key];
            this.setUniform(location, value);
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.positionBuffer);
        // TODO: Remove hard reference to "aPosition" name
        gl.vertexAttribPointer(material.shaderProgram.attributeLocations.aPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(material.shaderProgram.attributeLocations.aPosition);

        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.uvBuffer);
        // TODO: Remove hard reference to "aUv" name
        gl.vertexAttribPointer(material.shaderProgram.attributeLocations.aUv, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(material.shaderProgram.attributeLocations.aUv);

        const TODO = 6;
        gl.drawElements(gl.TRIANGLE_STRIP, TODO, gl.UNSIGNED_SHORT, mesh.indexBuffer);
    }

    setUniform(location, value) {
        const gl = this.gl;

        switch (value.length) {
            case 1:
                gl.uniform1fv(location, value);
                break;
            case 2:
                gl.uniform2fv(location, value);
                break;
            case 3:
                gl.uniform3fv(location, value);
                break;
            case 4:
                gl.uniform4fv(location, value);
                break;
            default:
                console.error(`Invalid uniform length: ${value.length}`);
        }
    }
}

export class ShaderProgram {
    constructor(gl, vertSource, fragSource, attributeKeys, uniformKeys) {
        const vertShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertShader, vertSource);
        gl.compileShader(vertShader);

        const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragShader, fragSource);
        gl.compileShader(fragShader);

        this.program = gl.createProgram();
        gl.attachShader(this.program, vertShader);
        gl.attachShader(this.program, fragShader);
        gl.linkProgram(this.program);

        this.attributeLocations = {};
        for (const key of attributeKeys) {
            this.attributeLocations[key] = gl.getAttribLocation(this.program, key);
        }

        this.uniformLocations = {};
        for (const key of uniformKeys) {
            this.uniformLocations[key] = gl.getUniformLocation(this.program, key);
        }
    }
}

// deprecated
export function createShaderProgram(gl, vertSource, fragSource) {
    const vertShader = createShader(gl, vertSource, gl.VERTEX_SHADER);
    const fragShader = createShader(gl, fragSource, gl.FRAGMENT_SHADER);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);

    return shaderProgram;
};

// deprecated
function createShader(gl, source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
};

// deprecated
export function getAttributeLocations(gl, shaderProgram, keys) {
    const locations = {};
    for (const key of keys) {
        locations[key] = gl.getAttribLocation(shaderProgram, key);
    }
    return locations;
};

// deprecated
export function getUniformLocations(gl, shaderProgram, keys) {
    const locations = {};
    for (const key of keys) {
        locations[key] = gl.getUniformLocation(shaderProgram, key);
    }
    return locations;
};