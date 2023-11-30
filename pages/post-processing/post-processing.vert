#version 300 es

in vec4 aPosition;
in vec2 aUv;

out highp vec2 vUv;

void main() {
    gl_Position = aPosition;
    vUv = aUv;
}