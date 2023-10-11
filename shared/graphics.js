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