// Goals
// - Separate mesh and material so they can be interchanged easily
// - Reduce the need for custom WebGL when creating new objects
// Uniforms
// - Global - time, resolution
// - Per material - color
// - Per instance - transform

export function draw(gl, mesh, shaderProgram, textures, uniforms) {
    gl.useProgram(shaderProgram.program);

    for (const [key, value] of Object.entries(uniforms)) {
        const { location, type } = shaderProgram.uniforms[key];
        setUniform(gl, location, type, value);
    }

    for (let i = 0; i < textures.length; i++) {
        gl.activeTexture(gl.TEXTURE0 + i);
        gl.bindTexture(gl.TEXTURE_2D, textures[i].texture);
    }

    for (const [key, attribute] of Object.entries(shaderProgram.attributes)) {
        const { length } = parseType(attribute.type);
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.attributes[key]);
        gl.vertexAttribPointer(attribute.location, length, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(attribute.location);
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);

    gl.drawElements(gl.TRIANGLES, mesh.indexCount, gl.UNSIGNED_SHORT, 0);
}

function setUniform(gl, location, typeStr, value) {
    const { isMatrix, length, type } = parseType(typeStr);
    switch (length) {
        case 1:
            if (Array.isArray(value)) {
                if (type === "f") {
                    gl.uniform1fv(location, value);
                } else if (type === "i") {
                    gl.uniform1iv(location, value);
                }
            } else {
                if (type === "f") {
                    gl.uniform1f(location, value);
                } else if (type === "i") {
                    gl.uniform1i(location, value);
                }
            }
            break;
        case 2:
            if (isMatrix) {
                gl.uniformMatrix2fv(location, false, value);
            } else if (type === "f") {
                gl.uniform2fv(location, value);
            } else if (type === "i") {
                gl.uniform2iv(location, value);
            }
            break;
        case 3:
            if (isMatrix) {
                gl.uniformMatrix3fv(location, false, value);
            } else if (type === "f") {
                gl.uniform3fv(location, value);
            } else if (type === "i") {
                gl.uniform3iv(location, value);
            }
            break;
        case 4:
            if (isMatrix) {
                gl.uniformMatrix4fv(location, false, value);
            } else if (type === "f") {
                gl.uniform4fv(location, value);
            } else if (type === "i") {
                gl.uniform4iv(location, value);
            }
            break;
        default:
            console.error(`Invalid uniform length: ${value.length}`);
    }
}

export class Texture {
    constructor(gl, image) {
        this.gl = gl;

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    }
}

export class Mesh {
    // Possible attributes: position, index, uv, normal, color
    constructor(gl, attributes) {
        this.attributes = {};

        this.attributes.aPosition = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.attributes.aPosition);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(attributes.position), gl.STATIC_DRAW);

        if (attributes.uv !== undefined) {
            this.attributes.aUv = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.attributes.aUv);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(attributes.uv), gl.STATIC_DRAW);
        }

        if (attributes.normal !== undefined) {
            this.attributes.aNormal = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.attributes.aNormal);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(attributes.normal), gl.STATIC_DRAW);
        }

        if (attributes.color !== undefined) {
            this.attributes.aColor = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.attributes.aColor);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(attributes.color), gl.STATIC_DRAW);
        }

        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(attributes.index), gl.STATIC_DRAW);

        this.indexCount = attributes.index.length;
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

function parseType(type) {
    const params = type.split("");
    if (params.length === 2) {
        return {
            isMatrix: false,
            length: Number(params[0]),
            type: params[1],
        };
    } else if (params.length === 3) {
        return {
            isMatrix: true,
            length: Number(params[1]),
            type: params[2],
        };
    }
}