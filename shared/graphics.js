// Goals
// - Separate mesh and material so they can be interchanged easily
// - Reduce the need for custom WebGL when creating new objects
// Uniforms
// - Global - time, resolution
// - Per material - color
// - Per instance - transform

export function draw(gl, mesh, shaderProgram, uniforms) {
    gl.useProgram(shaderProgram.program);

    for (const [key, value] of Object.entries(uniforms)) {
        const location = shaderProgram.uniformLocations[key];
        setUniform(gl, location, value);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.positionBuffer);
    // TODO: Remove hard reference to "aPosition" name
    gl.vertexAttribPointer(shaderProgram.attributeLocations.aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderProgram.attributeLocations.aPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.uvBuffer);
    // TODO: Remove hard reference to "aUv" name
    gl.vertexAttribPointer(shaderProgram.attributeLocations.aUv, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderProgram.attributeLocations.aUv);

    const TODO = 6;
    gl.drawElements(gl.TRIANGLE_STRIP, TODO, gl.UNSIGNED_SHORT, mesh.indexBuffer);
}

function setUniform(gl, location, value) {
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

export class Mesh {
    constructor(gl, positions, uvs, indices) {
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        this.uvBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);

        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
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