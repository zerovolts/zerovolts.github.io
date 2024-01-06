#version 300 es

precision mediump float;

uniform sampler2D board;

in vec2 vUv;

out vec4 fragColor;

void main() {
    vec3 color = texture(board, vUv).rgb;
    vec3 srgb = pow(color, vec3(1. / 2.2));
    fragColor = vec4(srgb, 1.);
}