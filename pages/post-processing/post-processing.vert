#version 300 es

in vec2 aPosition;
in vec2 aUv;

out highp vec2 vUv;

void main() {
    gl_Position = vec4(aPosition, 0., 1.);
    vUv = aUv;
}