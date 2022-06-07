#version 300 es

in vec4 position;
out float depth;

uniform vec2 dimensions;

void main() {
    vec4 pixelScale = vec4(2.0 / dimensions.x, 2.0 / dimensions.y, 1.0, 1.0);
    depth = position.z;
    gl_Position = position * pixelScale;
}