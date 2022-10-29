export const createShaderProgram = (gl, vertSource, fragSource) => {
    const vertShader = createShader(gl, vertSource, gl.VERTEX_SHADER);
    const fragShader = createShader(gl, fragSource, gl.FRAGMENT_SHADER);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);

    return shaderProgram;
};

const createShader = (gl, source, type) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
};

export const getAttributeLocations = (gl, shaderProgram, keys) => {
    const locations = {};
    for (const key of keys) {
        locations[key] = gl.getAttribLocation(shaderProgram, key);
    }
    return locations;
};

export const getUniformLocations = (gl, shaderProgram, keys) => {
    const locations = {};
    for (const key of keys) {
        locations[key] = gl.getUniformLocation(shaderProgram, key);
    }
    return locations;
};