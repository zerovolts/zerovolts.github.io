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
        const { location, type } = shaderProgram.uniforms[key];
        setUniform(gl, location, type, value);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.positionBuffer);
    // TODO: Remove hard reference to "aPosition" name
    gl.vertexAttribPointer(shaderProgram.attributes.aPosition.location, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderProgram.attributes.aPosition.location);

    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.uvBuffer);
    // TODO: Remove hard reference to "aUv" name
    gl.vertexAttribPointer(shaderProgram.attributes.aUv.location, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderProgram.attributes.aUv.location);

    gl.drawElements(gl.TRIANGLE_STRIP, mesh.indexCount, gl.UNSIGNED_SHORT, mesh.indexBuffer);
}

function setUniform(gl, location, type, value) {
    switch (value.length) {
        case 1:
            if (type === "f") {
                gl.uniform1fv(location, value);
            } else if (type === "i") {
                gl.uniform1iv(location, value);
            }
            break;
        case 2:
            if (type === "f") {
                gl.uniform2fv(location, value);
            } else if (type === "i") {
                gl.uniform2iv(location, value);
            }
            break;
        case 3:
            if (type === "f") {
                gl.uniform3fv(location, value);
            } else if (type === "i") {
                gl.uniform3iv(location, value);
            }
            break;
        case 4:
            if (type === "f") {
                gl.uniform4fv(location, value);
            } else if (type === "i") {
                gl.uniform4iv(location, value);
            }
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

        this.indexCount = indices.length;
    }
}

export class ShaderProgram {
    constructor(gl, vertSource, fragSource, attributeInfo, uniformInfo) {
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

        this.attributes = {};
        for (const [key, value] of Object.entries(attributeInfo)) {
            this.attributes[key] = {
                location: gl.getAttribLocation(this.program, key),
                type: value,
            };
        }

        this.uniforms = {};
        for (const [key, value] of Object.entries(uniformInfo)) {
            this.uniforms[key] = {
                location: gl.getUniformLocation(this.program, key),
                type: value,
            };
        }
    }
}