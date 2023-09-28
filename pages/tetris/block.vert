#version 300 es

uniform vec2 uCoord;

in vec2 aPosition;
in vec2 aUv;

out vec2 vUv;

void main() {
    // 10x22 grid with origin at bottom-left
    vec2 pos = (aPosition + uCoord) / vec2(5., 11.) - 1.;
    gl_Position = vec4(pos, 0., 1.);
    vUv = aUv;
}